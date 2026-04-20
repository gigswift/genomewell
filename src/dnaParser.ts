import JSZip from 'jszip';
import { ENGINE_RSIDS } from './engine/supplementRules';
import { SNP_CATALOG, getRiskLevel } from './snpCatalog';
import type { Genotype, SNPResult } from './types';

export interface ParsedDNA {
  results: SNPResult[];
  engineSnpMap: Map<string, Genotype>;
  totalRowsParsed: number;
}

async function readFileText(file: File): Promise<string> {
  if (file.name.endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
    const zip = await JSZip.loadAsync(file);
    const txtEntry = Object.values(zip.files).find(
      (f) => !f.dir && f.name.endsWith('.txt')
    );
    if (!txtEntry) {
      throw new Error('No .txt file found inside the ZIP archive. Please check that you downloaded the correct file from 23andMe or AncestryDNA.');
    }
    return txtEntry.async('string');
  }
  return file.text();
}

type FileFormat = '23andme' | 'ancestry' | 'unknown';

function detectFormat(headerLine: string): FileFormat {
  if (headerLine.includes('allele1') && headerLine.includes('allele2')) return 'ancestry';
  if (headerLine.includes('genotype')) return '23andme';
  const cols = headerLine.split('\t');
  if (cols.length === 5) return 'ancestry';
  if (cols.length === 4) return '23andme';
  return 'unknown';
}

function extractSnpMap(text: string): Map<string, { chromosome: string; position: string; genotype: string }> {
  const lines = text.split('\n');
  const snpMap = new Map<string, { chromosome: string; position: string; genotype: string }>();

  let format: FileFormat = 'unknown';
  let headerFound = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Detect format from the header row
    if (!headerFound && line.startsWith('rsid')) {
      format = detectFormat(line);
      headerFound = true;
      continue;
    }

    const cols = line.split('\t');
    if (cols.length < 4) continue;

    const rsid = cols[0].trim();
    if (!rsid.startsWith('rs')) continue;

    const chromosome = cols[1].trim();
    const position = cols[2].trim();
    let genotype = '';

    if (format === 'ancestry') {
      // AncestryDNA: rsid, chromosome, position, allele1, allele2
      const a1 = (cols[3] || '').trim();
      const a2 = (cols[4] || '').trim();
      genotype = a1 + a2;
    } else {
      // 23andMe: rsid, chromosome, position, genotype
      genotype = (cols[3] || '').trim();
    }

    // Skip no-calls
    if (!genotype || genotype === '--' || genotype === '00' || genotype === '0') continue;

    snpMap.set(rsid, { chromosome, position, genotype });
  }

  return snpMap;
}

export async function parseDNAFile(file: File): Promise<ParsedDNA> {
  const text = await readFileText(file);
  const snpMap = extractSnpMap(text);

  const results: SNPResult[] = [];

  for (const [rsid, def] of Object.entries(SNP_CATALOG)) {
    const data = snpMap.get(rsid);
    if (data) {
      const riskLevel = getRiskLevel(data.genotype, def);
      results.push({
        rsid,
        chromosome: data.chromosome,
        position: data.position,
        genotype: data.genotype,
        gene: def.gene,
        topic: def.topic,
        category: def.category,
        riskLevel,
        insight: def.insights[riskLevel],
        recommendation: def.recommendation,
      });
    }
  }

  // Side-channel map for the supplement engine: only rsids referenced by any rule.
  // Keeps the engine independent of SNP_CATALOG (which remains the legacy UI source).
  const engineSnpMap = new Map<string, Genotype>();
  for (const rsid of ENGINE_RSIDS) {
    const data = snpMap.get(rsid);
    if (data) engineSnpMap.set(rsid, data.genotype);
  }

  return { results, engineSnpMap, totalRowsParsed: snpMap.size };
}
