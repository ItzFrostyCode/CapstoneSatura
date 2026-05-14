const fs = require('fs');
const path = require('path');

// Colors to catch
const colorsToReplace = [
    { regex: /#ee4d2d/g, replacement: '#1e3a8a' }, // Orange
    { regex: /#d73211/g, replacement: '#172554' }, // Dark Orange
    { regex: /#111216/g, replacement: '#1e3a8a' }, // The blackish color that was there
];

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.next')) {
            walk(fullPath);
        } else if (stats.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            for (const item of colorsToReplace) {
                if (content.match(item.regex)) {
                    content = content.replace(item.regex, item.replacement);
                    changed = true;
                }
            }
            if (changed) {
                console.log(`Fixing colors in ${fullPath}`);
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

const projectRoot = '/Users/joshuawaymanarabejo/Documents/Projects/Websites/CapstoneSatura/sutura-clean-nextjs-prototype';
walk(path.join(projectRoot, 'app'));
walk(path.join(projectRoot, 'components'));
walk(path.join(projectRoot, 'store'));
walk(path.join(projectRoot, 'mocks'));
