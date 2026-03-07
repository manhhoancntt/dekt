import React from 'react';
import Markdown from 'react-markdown';
import { FileDown, RotateCcw } from 'lucide-react';
import { saveAs } from 'file-saver';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  Table, 
  TableCell, 
  TableRow, 
  WidthType,
  BorderStyle,
  VerticalAlign,
  Footer,
  PageNumber
} from 'docx';

interface TestPreviewProps {
  content: string;
  config: {
    grade: string;
    semester: string;
    duration: string;
    subject: string;
    schoolLevel: string;
  };
  onReset: () => void;
}

const TestPreview: React.FC<TestPreviewProps> = ({ content, config, onReset }) => {
  const exportToWord = async () => {
    const lines = content.split('\n');
    const children: any[] = [];

    // Standard School Header
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "SỞ GD&ĐT TỈNH/THÀNH PHỐ", size: 20 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "TRƯỜNG THCS/THPT .................", bold: true, size: 20 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: "--------------------", size: 20 })]
                }),
              ]
            }),
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: config.semester.toUpperCase(), bold: true, size: 22 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `MÔN: ${config.subject.toUpperCase()} - LỚP ${config.grade}`, bold: true, size: 22 })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: `Thời gian làm bài: ${config.duration} phút`, italics: true, size: 20 })]
                }),
              ]
            })
          ]
        })
      ]
    }));

    children.push(new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({ text: "Họ và tên học sinh: ................................................................. Lớp: .....................", size: 22 })
      ]
    }));

    children.push(new Paragraph({ spacing: { before: 400 } }));

    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (!line) {
        i++;
        continue;
      }

      // Handle Tables
      if (line.startsWith('|')) {
        const tableRows: TableRow[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          const rowLine = lines[i].trim();
          // Skip separator lines like |---|---|
          if (rowLine.includes('---')) {
            i++;
            continue;
          }
          
          const cells = rowLine.split('|').filter(c => c.trim() !== '' || (rowLine.startsWith('|') && rowLine.endsWith('|') && c === ''));
          // If it started and ended with |, split will have empty strings at start/end
          const actualCells = rowLine.startsWith('|') && rowLine.endsWith('|') 
            ? rowLine.slice(1, -1).split('|')
            : rowLine.split('|').filter(c => c.trim() !== '');

          tableRows.push(new TableRow({
            children: actualCells.map(cellText => new TableCell({
              children: [new Paragraph({ 
                children: parseInlineFormatting(cellText.trim()),
                alignment: AlignmentType.LEFT 
              })],
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 100 / actualCells.length, type: WidthType.PERCENTAGE }
            }))
          }));
          i++;
        }
        children.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        }));
        children.push(new Paragraph({ spacing: { after: 200 } }));
        continue;
      }

      // Handle Headers
      if (line.startsWith('# ')) {
        children.push(new Paragraph({
          children: [new TextRun({ text: line.replace('# ', ''), bold: true, size: 28 })],
          spacing: { before: 240, after: 120 },
          alignment: AlignmentType.CENTER
        }));
      } else if (line.startsWith('## ')) {
        children.push(new Paragraph({
          children: [new TextRun({ text: line.replace('## ', ''), bold: true, size: 24 })],
          spacing: { before: 200, after: 100 }
        }));
      } else if (line.startsWith('### ')) {
        children.push(new Paragraph({
          children: [new TextRun({ text: line.replace('### ', ''), bold: true, size: 20 })],
          spacing: { before: 160, after: 80 }
        }));
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        children.push(new Paragraph({
          children: parseInlineFormatting(line.slice(2)),
          bullet: { level: 0 },
          spacing: { after: 120 }
        }));
      } else if (/^\d+\./.test(line)) {
        children.push(new Paragraph({
          children: parseInlineFormatting(line),
          spacing: { after: 120 }
        }));
      } else {
        children.push(new Paragraph({
          children: parseInlineFormatting(line),
          spacing: { after: 120 }
        }));
      }
      i++;
    }

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 }
          }
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun("Trang "),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                  }),
                  new TextRun(" / "),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                  }),
                ],
              }),
            ],
          }),
        },
        children: children
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `De_minh_hoa_${config.grade}_${config.semester.replace(/\s+/g, '_')}.docx`);
  };

  const parseInlineFormatting = (text: string) => {
    // Simple bold/italic parser
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map(part => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return new TextRun({ text: part.slice(2, -2), bold: true });
      } else if (part.startsWith('*') && part.endsWith('*')) {
        return new TextRun({ text: part.slice(1, -1), italics: true });
      }
      return new TextRun({ text: part });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={exportToWord}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-md"
          >
            <FileDown size={18} />
            Xuất file Word
          </button>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all"
        >
          <RotateCcw size={16} />
          Làm lại
        </button>
      </div>

      <div className="prose prose-slate max-w-none bg-white p-8 md:p-12 rounded-xl border border-slate-200 shadow-sm">
        <div className="markdown-body">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  );
};

export default TestPreview;
