
export const applyFormatting = (
  formatType: string,
  selectedText: string
): string => {
  let formattedText = '';
  
  switch (formatType) {
    case 'bold':
      formattedText = `**${selectedText}**`;
      break;
    case 'italic':
      formattedText = `*${selectedText}*`;
      break;
    case 'underline':
      formattedText = `<u>${selectedText}</u>`;
      break;
    case 'strikethrough':
      formattedText = `~~${selectedText}~~`;
      break;
    case 'h1':
      formattedText = `# ${selectedText}`;
      break;
    case 'h2':
      formattedText = `## ${selectedText}`;
      break;
    case 'list-bullet':
      formattedText = selectedText
        .split('\n')
        .map(line => `- ${line}`)
        .join('\n');
      break;
    case 'list-numbered':
      formattedText = selectedText
        .split('\n')
        .map((line, i) => `${i + 1}. ${line}`)
        .join('\n');
      break;
    case 'align-left':
      formattedText = `<div style="text-align: left">${selectedText}</div>`;
      break;
    case 'align-center':
      formattedText = `<div style="text-align: center">${selectedText}</div>`;
      break;
    case 'align-right':
      formattedText = `<div style="text-align: right">${selectedText}</div>`;
      break;
    case 'code':
      formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
      break;
    case 'quote':
      formattedText = selectedText
        .split('\n')
        .map(line => `> ${line}`)
        .join('\n');
      break;
    default:
      formattedText = selectedText;
  }
  
  return formattedText;
};

export const getEmptyFormatting = (formatType: string): string => {
  switch (formatType) {
    case 'bold':
      return '**Bold text**';
    case 'italic':
      return '*Italic text*';
    case 'underline':
      return '<u>Underlined text</u>';
    case 'strikethrough':
      return '~~Strikethrough text~~';
    case 'h1':
      return '# Heading 1';
    case 'h2':
      return '## Heading 2';
    case 'list-bullet':
      return '- Bullet item';
    case 'list-numbered':
      return '1. Numbered item';
    case 'align-left':
      return '<div style="text-align: left">Left aligned text</div>';
    case 'align-center':
      return '<div style="text-align: center">Center aligned text</div>';
    case 'align-right':
      return '<div style="text-align: right">Right aligned text</div>';
    case 'code':
      return '```\nCode block\n```';
    case 'quote':
      return '> Quote';
    default:
      return '';
  }
};
