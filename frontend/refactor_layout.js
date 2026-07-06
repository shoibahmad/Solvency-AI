const fs = require('fs');
const path = require('path');

const files = [
  'd:/Solvency AI/frontend/src/app/layout.tsx',
  'd:/Solvency AI/frontend/src/app/dashboard/layout.tsx'
];

const viewsDir = 'd:/Solvency AI/frontend/src/views';

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract imports and content
  // Actually, wait, layout files export default function RootLayout / DashboardLayout
  const match = content.match(/export default function ([a-zA-Z0-9]+)\s*\(/);
  if (!match) {
    console.log('Skipping ' + filePath + ' (no match)');
    return;
  }
  
  const originalName = match[1]; // RootLayout
  const viewName = originalName + 'View'; // RootLayoutView
  
  // Replace export default function BaseName with export function BaseView
  let viewContent = content.replace(
    new RegExp(`export default function ${originalName}\\s*\\(`), 
    `export function ${viewName}(`
  );
  
  // For metadata in RootLayout, let's keep metadata in layout.tsx as it needs to be exported from the Next.js page
  // We'll remove metadata export from viewContent and put it in layout.tsx
  let metadataMatch = viewContent.match(/export const metadata.*?};\n/s);
  let metadataExport = '';
  if (metadataMatch) {
      metadataExport = metadataMatch[0];
      viewContent = viewContent.replace(metadataMatch[0], '');
  }

  // Remove "use client" from layout.tsx because layout might be server component
  
  const viewPath = path.join(viewsDir, viewName + '.tsx');
  fs.writeFileSync(viewPath, viewContent);
  
  // Create simple layout.tsx
  // We need to import React if we use children
  const newPageContent = `${metadataExport}\nimport { ${viewName} } from "@/views/${viewName}";\n\nexport default function ${originalName}({ children }: { children: React.ReactNode }) {\n  return <${viewName}>{children}</${viewName}>;\n}\n`;
  fs.writeFileSync(filePath, newPageContent);
  
  console.log(`Refactored ${filePath} -> ${viewName}.tsx`);
});
