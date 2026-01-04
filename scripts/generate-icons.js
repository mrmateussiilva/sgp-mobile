#!/usr/bin/env node

/**
 * Script para gerar ícones PWA a partir do SVG
 * Requer: sharp (npm install -D sharp)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verifica se sharp está disponível
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.error('❌ Erro: sharp não está instalado.');
  console.log('📦 Instale com: pnpm add -D sharp');
  process.exit(1);
}

const publicDir = path.join(__dirname, '../public');
const svgPath = path.join(publicDir, 'icon.svg');

if (!fs.existsSync(svgPath)) {
  console.error('❌ Erro: icon.svg não encontrado em public/');
  process.exit(1);
}

const sizes = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

async function generateIcons() {
  console.log('🎨 Gerando ícones PWA...\n');

  for (const { size, name } of sizes) {
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, name));
      
      console.log(`✅ ${name} (${size}x${size}) criado`);
    } catch (error) {
      console.error(`❌ Erro ao criar ${name}:`, error.message);
    }
  }

  console.log('\n✨ Ícones gerados com sucesso!');
}

generateIcons().catch(console.error);

