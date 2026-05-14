const fs = require('fs');
const path = require('path');

const dir = '/Users/joshuawaymanarabejo/Documents/Projects/Websites/CapstoneSatura/sutura-clean-nextjs-prototype/app/(owner-portal)/owner';

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    file = path.join(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(dir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace backgrounds
  content = content.replace(/bg-\[\#1E3A1F\]/g, 'bg-slate-900');
  content = content.replace(/bg-\[\#1E3A1F\]\/5/g, 'bg-slate-50');
  content = content.replace(/bg-\[\#1E3A1F\]\/10/g, 'bg-slate-100');
  content = content.replace(/bg-\[\#1E3A1F\]\/20/g, 'bg-slate-200');

  // Replace texts
  content = content.replace(/text-\[\#1E3A1F\]/g, 'text-slate-900');
  
  // Replace borders
  content = content.replace(/border-\[\#1E3A1F\]/g, 'border-slate-900');
  content = content.replace(/border-\[\#1E3A1F\]\/10/g, 'border-slate-200');
  content = content.replace(/border-\[\#1E3A1F\]\/20/g, 'border-slate-200');
  content = content.replace(/border-\[\#1E3A1F\]\/30/g, 'border-slate-300');

  // Replace shadow
  content = content.replace(/shadow-\[\#1E3A1F\]\/20/g, 'shadow-slate-900/20');
  content = content.replace(/shadow-\[\#1E3A1F\]\/10/g, 'shadow-slate-900/10');
  content = content.replace(/shadow-\[\#1E3A1F\]\/5/g, 'shadow-slate-900/5');

  // Replace gold (C9A84C)
  content = content.replace(/bg-\[\#C9A84C\]/g, 'bg-indigo-600');
  content = content.replace(/bg-\[\#C9A84C\]\/5/g, 'bg-indigo-50');
  content = content.replace(/text-\[\#C9A84C\]/g, 'text-white'); // gold text is usually on dark bg, so white is better. If it was on white, maybe indigo-600. We'll use text-white generally.
  content = content.replace(/border-\[\#C9A84C\]/g, 'border-indigo-600');
  content = content.replace(/border-\[\#C9A84C\]\/20/g, 'border-indigo-200');
  content = content.replace(/border-\[\#C9A84C\]\/10/g, 'border-indigo-100');

  // Fonts
  content = content.replace(/font-serif/g, 'font-sans');
  content = content.replace(/font-outfit/g, 'font-sans');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
