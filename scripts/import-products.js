import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { storage } from '../server/storage.ts';

// Read and parse HTML files
const parseHTMLFile = (filePath) => {
  const html = readFileSync(filePath, 'utf8');
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  const products = [];
  const productCards = document.querySelectorAll('.flex.flex-col.items-center.p-2.bg-white.rounded.shadow.w-40');
  
  productCards.forEach(card => {
    const img = card.querySelector('img');
    const name = card.querySelector('h3')?.textContent?.trim();
    const description = card.querySelector('.text-xs.text-gray-600')?.textContent?.trim();
    const priceText = card.querySelector('.text-xs.text-green-600')?.textContent?.trim();
    
    if (name && priceText) {
      // Extract price from text like "Chakana: $30" or "Chakana: $117.0"
      const priceMatch = priceText.match(/\$(\d+(?:\.\d+)?)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
      
      products.push({
        name: name,
        description: description || '',
        price: price,
        imageUrl: img?.src || '',
        inStock: true,
        features: []
      });
    }
  });
  
  return products;
};

const importProducts = async () => {
  try {
    // Parse all product files
    const ezvizProducts = parseHTMLFile('attached_assets/ezviz_kameralar_faqat_chakana_1749828496699.html');
    const hilookIPProducts = parseHTMLFile('attached_assets/hilook_ip_kameralar_chakana_1749828501839.html');
    const hilookTurboProducts = parseHTMLFile('attached_assets/hilook_turbo_kameralar_chakana_1749828509136.html');
    const hilookAccessoryProducts = parseHTMLFile('attached_assets/hilook_aksessuar_chakana_1749828519579.html');
    const hilookDVRProducts = parseHTMLFile('attached_assets/hilook_dvr_chakana_1749828523615.html');
    const hilookPTZProducts = parseHTMLFile('attached_assets/hilook_ptz_chakana_1749828526682.html');

    // Add category and brand information
    const productsToImport = [
      ...ezvizProducts.map(p => ({ ...p, category: 'IP Kameralar', brand: 'Ezviz' })),
      ...hilookIPProducts.map(p => ({ ...p, category: 'IP Kameralar', brand: 'Hilook' })),
      ...hilookTurboProducts.map(p => ({ ...p, category: 'Turbo HD Kameralar', brand: 'Hilook' })),
      ...hilookAccessoryProducts.map(p => ({ ...p, category: 'Aksessuarlar', brand: 'Hilook' })),
      ...hilookDVRProducts.map(p => ({ ...p, category: 'DVR Qurilmalari', brand: 'Hilook' })),
      ...hilookPTZProducts.map(p => ({ ...p, category: 'PTZ Kameralar', brand: 'Hilook' }))
    ];

    console.log(`Importing ${productsToImport.length} products...`);

    // Import products to database
    for (const product of productsToImport) {
      try {
        await storage.createProduct(product);
        console.log(`Imported: ${product.name}`);
      } catch (error) {
        console.error(`Failed to import ${product.name}:`, error.message);
      }
    }

    console.log('Import completed!');
  } catch (error) {
    console.error('Import failed:', error);
  }
};

importProducts();