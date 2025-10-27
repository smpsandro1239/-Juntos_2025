import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'markdown',
  standalone: true,
})
export class MarkdownPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    let html = value;

    // Remove potential markdown wrappers from AI response
    html = html.replace(/^```markdown\n/, '').replace(/\n```$/, '');

    // Process each line
    html = html
      .split('\n')
      .map(line => {
        // Headings
        if (line.startsWith('### ')) {
          return `<h3>${line.substring(4)}</h3>`;
        }
        if (line.startsWith('## ')) {
          return `<h2>${line.substring(3)}</h2>`;
        }
        if (line.startsWith('# ')) {
          return `<h1>${line.substring(2)}</h1>`;
        }
        // Unordered list items
        if (line.startsWith('- ')) {
          return `<li>${line.substring(2)}</li>`;
        }
        if (line.startsWith('* ')) {
            return `<li>${line.substring(2)}</li>`;
        }
        return line.trim() ? `<p>${line}</p>` : '<br>';
      })
      .join('');
      
    // Wrap consecutive list items in <ul>
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');

    return html;
  }
}
