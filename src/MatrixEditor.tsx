import React, { useState, useEffect, useMemo } from 'react';
import { MatrixData, MatrixRow, AssessmentLevel } from './types';
import { Plus, Minus, RotateCcw, Settings2, Target, FileDown } from 'lucide-react';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, VerticalAlign, TextRun, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

interface MatrixEditorProps {
  initialData: MatrixRow[];
  config: {
    grade: string;
    semester: string;
    duration: string;
    levels: { nb: number; th: number; vd: number; vdc: number };
    ratios: { tn4: number; ds: number; dien: number; tl: number };
  };
}

const MatrixEditor: React.FC<MatrixEditorProps> = ({ initialData, config }) => {
  const [rows, setRows] = useState<MatrixRow[]>(initialData);
  const [points, setPoints] = useState({
    tnkq_choice: 0.25,
    tnkq_tf: 0.25,
    tnkq_short: 0.5,
    essay: 1.0
  });

  useEffect(() => {
    setRows(initialData);
  }, [initialData]);

  const updateCellPoint = (rowIndex: number, type: keyof typeof points, level: keyof AssessmentLevel | 'all', delta: number) => {
    if (rowIndex === -1) {
      setPoints(prev => ({
        ...prev,
        [type]: Math.max(0, prev[type] + delta)
      }));
      setRows(prev => prev.map(row => {
        const currentPoints = row.points || {
          tnkq_choice: { knowing: points.tnkq_choice, understanding: points.tnkq_choice, applying: points.tnkq_choice },
          tnkq_tf: { knowing: points.tnkq_tf, understanding: points.tnkq_tf, applying: points.tnkq_tf },
          tnkq_short: { knowing: points.tnkq_short, understanding: points.tnkq_short, applying: points.tnkq_short },
          essay: { knowing: points.essay, understanding: points.essay, applying: points.essay },
        };
        const newTypePoints = { ...currentPoints[type] };
        if (level === 'all') {
          newTypePoints.knowing = Math.max(0, newTypePoints.knowing + delta);
          newTypePoints.understanding = Math.max(0, newTypePoints.understanding + delta);
          newTypePoints.applying = Math.max(0, newTypePoints.applying + delta);
        } else {
          newTypePoints[level] = Math.max(0, newTypePoints[level] + delta);
        }
        return {
          ...row,
          points: { ...currentPoints, [type]: newTypePoints }
        };
      }));
    } else {
      setRows(prev => prev.map((row, idx) => {
        if (idx === rowIndex) {
          const currentPoints = row.points || {
            tnkq_choice: { knowing: points.tnkq_choice, understanding: points.tnkq_choice, applying: points.tnkq_choice },
            tnkq_tf: { knowing: points.tnkq_tf, understanding: points.tnkq_tf, applying: points.tnkq_tf },
            tnkq_short: { knowing: points.tnkq_short, understanding: points.tnkq_short, applying: points.tnkq_short },
            essay: { knowing: points.essay, understanding: points.essay, applying: points.essay },
          };
          const newTypePoints = { ...currentPoints[type] };
          if (level === 'all') {
            newTypePoints.knowing = Math.max(0, newTypePoints.knowing + delta);
            newTypePoints.understanding = Math.max(0, newTypePoints.understanding + delta);
            newTypePoints.applying = Math.max(0, newTypePoints.applying + delta);
          } else {
            newTypePoints[level] = Math.max(0, newTypePoints[level] + delta);
          }
          return {
            ...row,
            points: { ...currentPoints, [type]: newTypePoints }
          };
        }
        return row;
      }));
    }
  };

  // Target points based on percentages
  const targets = {
    tnkq_choice: (config.ratios.tn4 / 100) * 10,
    tnkq_tf: (config.ratios.ds / 100) * 10,
    tnkq_short: (config.ratios.dien / 100) * 10,
    essay: (config.ratios.tl / 100) * 10,
    knowing: ((config.levels.nb) / 100) * 10,
    understanding: ((config.levels.th) / 100) * 10,
    applying: ((config.levels.vd + config.levels.vdc) / 100) * 10
  };

  const exportToWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "KHUNG MA TRẬN ĐỀ KIỂM TRA",
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${config.semester.toUpperCase()} — MÔN TIN — LỚP ${config.grade} (${config.duration} PHÚT)`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header Row 1
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "TT", alignment: AlignmentType.CENTER })], rowSpan: 3, verticalAlign: VerticalAlign.CENTER }),
                  new TableCell({ children: [new Paragraph({ text: "Chương/ Chủ đề", alignment: AlignmentType.CENTER })], rowSpan: 3, verticalAlign: VerticalAlign.CENTER }),
                  new TableCell({ children: [new Paragraph({ text: "Nội dung/ Đơn vị kiến thức", alignment: AlignmentType.CENTER })], rowSpan: 3, verticalAlign: VerticalAlign.CENTER }),
                  new TableCell({ children: [new Paragraph({ text: "MỨC ĐỘ ĐÁNH GIÁ", alignment: AlignmentType.CENTER })], columnSpan: 12, verticalAlign: VerticalAlign.CENTER }),
                  new TableCell({ children: [new Paragraph({ text: "Tổng Số Câu", alignment: AlignmentType.CENTER })], columnSpan: 3, rowSpan: 2, verticalAlign: VerticalAlign.CENTER }),
                  new TableCell({ children: [new Paragraph({ text: "Tỉ lệ % Điểm", alignment: AlignmentType.CENTER })], rowSpan: 3, verticalAlign: VerticalAlign.CENTER }),
                ],
              }),
              // Header Row 2
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "TNKQ (Nhiều lựa chọn)", alignment: AlignmentType.CENTER })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ text: "TNKQ (Đúng - Sai)", alignment: AlignmentType.CENTER })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ text: "TNKQ (Trả lời ngắn)", alignment: AlignmentType.CENTER })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ text: "Tự luận", alignment: AlignmentType.CENTER })], columnSpan: 3 }),
                ],
              }),
              // Header Row 3
              new TableRow({
                children: [
                  ...Array(5).fill(null).flatMap(() => [
                    new TableCell({ children: [new Paragraph({ text: "Biết", alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: "Hiểu", alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ text: "VD", alignment: AlignmentType.CENTER })] }),
                  ])
                ],
              }),
              // Data Rows
              ...rows.map((row, idx) => {
                const c = row.tnkq_choice || { knowing: 0, understanding: 0, applying: 0 };
                const t = row.tnkq_tf || { knowing: 0, understanding: 0, applying: 0 };
                const s = row.tnkq_short || { knowing: 0, understanding: 0, applying: 0 };
                const e = row.essay || { knowing: 0, understanding: 0, applying: 0 };

                const rowTotalKnowing = (c.knowing || 0) + (t.knowing || 0) + (s.knowing || 0) + (e.knowing || 0);
                const rowTotalUnderstanding = (c.understanding || 0) + (t.understanding || 0) + (s.understanding || 0) + (e.understanding || 0);
                const rowTotalApplying = (c.applying || 0) + (t.applying || 0) + (s.applying || 0) + (e.applying || 0);
                
                const rowPoints = ((c.knowing || 0) * (row.points?.tnkq_choice?.knowing ?? points.tnkq_choice)) +
                                  ((c.understanding || 0) * (row.points?.tnkq_choice?.understanding ?? points.tnkq_choice)) +
                                  ((c.applying || 0) * (row.points?.tnkq_choice?.applying ?? points.tnkq_choice)) +
                                  ((t.knowing || 0) * (row.points?.tnkq_tf?.knowing ?? points.tnkq_tf)) +
                                  ((t.understanding || 0) * (row.points?.tnkq_tf?.understanding ?? points.tnkq_tf)) +
                                  ((t.applying || 0) * (row.points?.tnkq_tf?.applying ?? points.tnkq_tf)) +
                                  ((s.knowing || 0) * (row.points?.tnkq_short?.knowing ?? points.tnkq_short)) +
                                  ((s.understanding || 0) * (row.points?.tnkq_short?.understanding ?? points.tnkq_short)) +
                                  ((s.applying || 0) * (row.points?.tnkq_short?.applying ?? points.tnkq_short)) +
                                  ((e.knowing || 0) * (row.points?.essay?.knowing ?? points.essay)) +
                                  ((e.understanding || 0) * (row.points?.essay?.understanding ?? points.essay)) +
                                  ((e.applying || 0) * (row.points?.essay?.applying ?? points.essay));

                const cells = [
                  new TableCell({ children: [new Paragraph({ text: (idx + 1).toString(), alignment: AlignmentType.CENTER })] }),
                ];

                // Topic Title with RowSpan
                if (topicSpans[idx]) {
                  cells.push(new TableCell({ 
                    children: [new Paragraph({ 
                      children: [new TextRun({ text: row.topicTitle, bold: true })]
                    })],
                    rowSpan: topicSpans[idx],
                    verticalAlign: VerticalAlign.CENTER
                  }));
                }

                cells.push(
                  new TableCell({ children: [new Paragraph({ text: row.contentTitle })] }),
                  // TNKQ Choice
                  new TableCell({ children: [new Paragraph({ text: (c.knowing || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: (c.understanding || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: (c.applying || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  // TNKQ TF
                  new TableCell({ children: [new Paragraph({ text: (t.knowing || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: (t.understanding || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: (t.applying || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  // TNKQ Short
                  new TableCell({ children: [new Paragraph({ text: (s.knowing || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: (s.understanding || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: (s.applying || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  // Essay
                  new TableCell({ children: [new Paragraph({ text: (e.knowing || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: (e.understanding || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: (e.applying || 0).toString(), alignment: AlignmentType.CENTER })] }),
                  // Totals
                  new TableCell({ children: [new Paragraph({ text: rowTotalKnowing.toString(), alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: rowTotalUnderstanding.toString(), alignment: AlignmentType.CENTER })] }),
                  new TableCell({ children: [new Paragraph({ text: rowTotalApplying.toString(), alignment: AlignmentType.CENTER })] }),
                  // Percentage
                  new TableCell({ children: [new Paragraph({ text: `${((rowPoints / 10) * 100).toFixed(1)}%`, alignment: AlignmentType.CENTER })] }),
                );

                return new TableRow({ children: cells });
              }),
              // Footer Row 1: Tổng số câu
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TỔNG SỐ CÂU", bold: true })] })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: totals.tnkq_choice.total.toString(), bold: true })] })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: totals.tnkq_tf.total.toString(), bold: true })] })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: totals.tnkq_short.total.toString(), bold: true })] })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: totals.essay.total.toString(), bold: true })] })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: totals.knowing.toString(), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: totals.understanding.toString(), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: totals.applying.toString(), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "100%", bold: true })] })] }),
                ]
              }),
              // Footer Row 2: Tổng điểm
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "TỔNG ĐIỂM", alignment: AlignmentType.CENTER })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ text: `${(totals.tnkq_choice.total * points.tnkq_choice).toFixed(2)} / ${targets.tnkq_choice.toFixed(1)}`, alignment: AlignmentType.CENTER })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ text: `${(totals.tnkq_tf.total * points.tnkq_tf).toFixed(2)} / ${targets.tnkq_tf.toFixed(1)}`, alignment: AlignmentType.CENTER })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ text: `${(totals.tnkq_short.total * points.tnkq_short).toFixed(2)} / ${targets.tnkq_short.toFixed(1)}`, alignment: AlignmentType.CENTER })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ text: `${(totals.essay.total * points.essay).toFixed(2)} / ${targets.essay.toFixed(1)}`, alignment: AlignmentType.CENTER })], columnSpan: 3 }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: totals.knowingPoints.toFixed(2), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: totals.understandingPoints.toFixed(2), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: totals.applyingPoints.toFixed(2), bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${totals.totalPoints.toFixed(2)} / 10.0`, bold: true })] })], columnSpan: 1 }),
                ]
              }),
            ]
          })
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Ma_tran_de_kiem_tra_${config.grade}_${config.semester}.docx`);
  };

  const updateCell = (index: number, type: 'tnkq_choice' | 'tnkq_tf' | 'tnkq_short' | 'essay', level: keyof AssessmentLevel, delta: number) => {
    setRows(prev => prev.map((row, i) => {
      if (i === index) {
        const currentType = row[type] || { knowing: 0, understanding: 0, applying: 0 };
        const newValue = Math.max(0, (currentType[level] || 0) + delta);
        return {
          ...row,
          [type]: {
            ...currentType,
            [level]: newValue
          }
        };
      }
      return row;
    }));
  };

  const totals = useMemo(() => {
    const res = {
      tnkq_choice: { knowing: 0, understanding: 0, applying: 0, total: 0, points: 0 },
      tnkq_tf: { knowing: 0, understanding: 0, applying: 0, total: 0, points: 0 },
      tnkq_short: { knowing: 0, understanding: 0, applying: 0, total: 0, points: 0 },
      essay: { knowing: 0, understanding: 0, applying: 0, total: 0, points: 0 },
      knowing: 0,
      understanding: 0,
      applying: 0,
      knowingPoints: 0,
      understandingPoints: 0,
      applyingPoints: 0,
      totalQuestions: 0,
      totalPoints: 0
    };

    rows.forEach(row => {
      (['tnkq_choice', 'tnkq_tf', 'tnkq_short', 'essay'] as const).forEach(type => {
        const data = row[type] || { knowing: 0, understanding: 0, applying: 0 };
        const k = data.knowing || 0;
        const u = data.understanding || 0;
        const a = data.applying || 0;
        const pK = row.points?.[type]?.knowing ?? points[type];
        const pU = row.points?.[type]?.understanding ?? points[type];
        const pA = row.points?.[type]?.applying ?? points[type];

        const typePoints = (k * pK) + (u * pU) + (a * pA);

        res[type].knowing += k;
        res[type].understanding += u;
        res[type].applying += a;
        res[type].total += (k + u + a);
        res[type].points += typePoints;
        
        res.knowing += k;
        res.understanding += u;
        res.applying += a;

        res.knowingPoints += k * pK;
        res.understandingPoints += u * pU;
        res.applyingPoints += a * pA;
        
        res.totalPoints += typePoints;
      });
    });

    res.totalQuestions = res.tnkq_choice.total + res.tnkq_tf.total + res.tnkq_short.total + res.essay.total;
    return res;
  }, [rows, points]);

  // Calculate row spans for topics
  const topicSpans = useMemo(() => {
    const spans: { [key: number]: number } = {};
    let i = 0;
    while (i < rows.length) {
      let count = 1;
      while (i + count < rows.length && rows[i + count].topicTitle === rows[i].topicTitle) {
        count++;
      }
      spans[i] = count;
      i += count;
    }
    return spans;
  }, [rows]);

  const renderCell = (row: MatrixRow, index: number, type: 'tnkq_choice' | 'tnkq_tf' | 'tnkq_short' | 'essay', level: keyof AssessmentLevel, color: string) => {
    const data = row[type] || { knowing: 0, understanding: 0, applying: 0 };
    const val = data[level] || 0;
    const currentPoint = row.points?.[type]?.[level] ?? points[type];
    return (
      <td className={`border border-slate-200 p-1 min-w-[90px] group relative ${color}`}>
        <div className="flex flex-col items-center justify-center gap-1.5 py-1">
          {/* Question Count Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => updateCell(index, type, level, -1)}
              className="p-0.5 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-colors"
              title="Giảm số câu"
            >
              <Minus size={10} />
            </button>
            <span className="text-sm font-black text-slate-800 w-4 text-center">{val}</span>
            <button 
              onClick={() => updateCell(index, type, level, 1)}
              className="p-0.5 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-400 hover:text-blue-500 transition-colors"
              title="Tăng số câu"
            >
              <Plus size={10} />
            </button>
          </div>

          {/* Point Controls */}
          <div className="flex items-center gap-1 bg-white/50 rounded-md px-1 py-0.5 border border-transparent group-hover:border-slate-200 transition-all">
            <button 
              onClick={() => updateCellPoint(index, type, level, -0.25)}
              className="p-0.5 text-slate-300 hover:text-orange-600 transition-colors"
              title="Giảm điểm mỗi câu"
            >
              <Minus size={8} />
            </button>
            <span className="text-[10px] font-bold text-slate-500 min-w-[32px] text-center">
              {currentPoint}<span className="text-[8px] ml-0.5 font-normal">đ</span>
            </span>
            <button 
              onClick={() => updateCellPoint(index, type, level, 0.25)}
              className="p-0.5 text-slate-300 hover:text-emerald-600 transition-colors"
              title="Tăng điểm mỗi câu"
            >
              <Plus size={8} />
            </button>
          </div>
        </div>
      </td>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Khung Ma Trận Đề Kiểm Tra</h2>
        <p className="text-sm font-medium text-slate-500 uppercase">
          {config.semester} — Môn Tin — Lớp {config.grade} ({config.duration} phút)
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-end">
        <button 
          onClick={exportToWord}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <FileDown size={16} />
          Xuất file Word
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-50">
              <th rowSpan={3} className="border border-slate-200 p-2 w-10">TT</th>
              <th rowSpan={3} className="border border-slate-200 p-2 min-w-[120px]">Chương/ Chủ đề</th>
              <th rowSpan={3} className="border border-slate-200 p-2 min-w-[150px]">Nội dung/ Đơn vị kiến thức</th>
              <th colSpan={12} className="border border-slate-200 p-2 bg-indigo-50/30 text-indigo-900">MỨC ĐỘ ĐÁNH GIÁ</th>
              <th colSpan={3} rowSpan={2} className="border border-slate-200 p-2 bg-slate-100">Tổng Số Câu</th>
              <th rowSpan={3} className="border border-slate-200 p-2 min-w-[80px]">Tỉ lệ % Điểm</th>
            </tr>
            <tr className="bg-slate-50">
              <th colSpan={3} className="border border-slate-200 p-2 bg-blue-50 text-blue-700 font-black">TNKQ (Nhiều lựa chọn)</th>
              <th colSpan={3} className="border border-slate-200 p-2 bg-purple-50 text-purple-700 font-black">TNKQ (Đúng - Sai)</th>
              <th colSpan={3} className="border border-slate-200 p-2 bg-emerald-50 text-emerald-700 font-black">TNKQ (Trả lời ngắn)</th>
              <th colSpan={3} className="border border-slate-200 p-2 bg-orange-50 text-orange-700 font-black">Tự luận</th>
            </tr>
            <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              <th className="border border-slate-200 p-1">Biết</th><th className="border border-slate-200 p-1">Hiểu</th><th className="border border-slate-200 p-1">VD</th>
              <th className="border border-slate-200 p-1">Biết</th><th className="border border-slate-200 p-1">Hiểu</th><th className="border border-slate-200 p-1">VD</th>
              <th className="border border-slate-200 p-1">Biết</th><th className="border border-slate-200 p-1">Hiểu</th><th className="border border-slate-200 p-1">VD</th>
              <th className="border border-slate-200 p-1">Biết</th><th className="border border-slate-200 p-1">Hiểu</th><th className="border border-slate-200 p-1">VD</th>
              <th className="border border-slate-200 p-1">Biết</th><th className="border border-slate-200 p-1">Hiểu</th><th className="border border-slate-200 p-1">VD</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const c = row.tnkq_choice || { knowing: 0, understanding: 0, applying: 0 };
              const t = row.tnkq_tf || { knowing: 0, understanding: 0, applying: 0 };
              const s = row.tnkq_short || { knowing: 0, understanding: 0, applying: 0 };
              const e = row.essay || { knowing: 0, understanding: 0, applying: 0 };

              const rowTotalKnowing = (c.knowing || 0) + (t.knowing || 0) + (s.knowing || 0) + (e.knowing || 0);
              const rowTotalUnderstanding = (c.understanding || 0) + (t.understanding || 0) + (s.understanding || 0) + (e.understanding || 0);
              const rowTotalApplying = (c.applying || 0) + (t.applying || 0) + (s.applying || 0) + (e.applying || 0);
              
                const rowPoints = ((c.knowing || 0) * (row.points?.tnkq_choice?.knowing ?? points.tnkq_choice)) +
                                  ((c.understanding || 0) * (row.points?.tnkq_choice?.understanding ?? points.tnkq_choice)) +
                                  ((c.applying || 0) * (row.points?.tnkq_choice?.applying ?? points.tnkq_choice)) +
                                  ((t.knowing || 0) * (row.points?.tnkq_tf?.knowing ?? points.tnkq_tf)) +
                                  ((t.understanding || 0) * (row.points?.tnkq_tf?.understanding ?? points.tnkq_tf)) +
                                  ((t.applying || 0) * (row.points?.tnkq_tf?.applying ?? points.tnkq_tf)) +
                                  ((s.knowing || 0) * (row.points?.tnkq_short?.knowing ?? points.tnkq_short)) +
                                  ((s.understanding || 0) * (row.points?.tnkq_short?.understanding ?? points.tnkq_short)) +
                                  ((s.applying || 0) * (row.points?.tnkq_short?.applying ?? points.tnkq_short)) +
                                  ((e.knowing || 0) * (row.points?.essay?.knowing ?? points.essay)) +
                                  ((e.understanding || 0) * (row.points?.essay?.understanding ?? points.essay)) +
                                  ((e.applying || 0) * (row.points?.essay?.applying ?? points.essay));
              
              return (
                <tr key={row.id || idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="border border-slate-200 p-2 text-center text-slate-400 font-medium">{idx + 1}</td>
                  {topicSpans[idx] && (
                    <td 
                      rowSpan={topicSpans[idx]} 
                      className="border border-slate-200 p-2 font-bold text-slate-700 text-xs bg-slate-50/30"
                    >
                      {row.topicTitle}
                    </td>
                  )}
                  <td className="border border-slate-200 p-2 text-slate-600">
                    <div className="font-medium text-slate-800 text-xs">{row.contentTitle}</div>
                  </td>
                  {renderCell(row, idx, 'tnkq_choice', 'knowing', 'bg-blue-50/10')}
                  {renderCell(row, idx, 'tnkq_choice', 'understanding', 'bg-blue-50/10')}
                  {renderCell(row, idx, 'tnkq_choice', 'applying', 'bg-blue-50/10')}
                  
                  {renderCell(row, idx, 'tnkq_tf', 'knowing', 'bg-purple-50/10')}
                  {renderCell(row, idx, 'tnkq_tf', 'understanding', 'bg-purple-50/10')}
                  {renderCell(row, idx, 'tnkq_tf', 'applying', 'bg-purple-50/10')}
                  
                  {renderCell(row, idx, 'tnkq_short', 'knowing', 'bg-emerald-50/10')}
                  {renderCell(row, idx, 'tnkq_short', 'understanding', 'bg-emerald-50/10')}
                  {renderCell(row, idx, 'tnkq_short', 'applying', 'bg-emerald-50/10')}
                  
                  {renderCell(row, idx, 'essay', 'knowing', 'bg-orange-50/10')}
                  {renderCell(row, idx, 'essay', 'understanding', 'bg-orange-50/10')}
                  {renderCell(row, idx, 'essay', 'applying', 'bg-orange-50/10')}

                  <td className="border border-slate-200 p-2 text-center font-black text-slate-700 bg-slate-50/50">{rowTotalKnowing}</td>
                  <td className="border border-slate-200 p-2 text-center font-black text-slate-700 bg-slate-50/50">{rowTotalUnderstanding}</td>
                  <td className="border border-slate-200 p-2 text-center font-black text-slate-700 bg-slate-50/50">{rowTotalApplying}</td>
                  
                  <td className="border border-slate-200 p-2 text-center font-black text-red-500">
                    {((rowPoints / 10) * 100).toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50/80 font-black">
            <tr className="bg-slate-100/50">
              <td colSpan={3} className="border border-slate-200 p-4 text-center uppercase tracking-widest text-slate-800">TỔNG SỐ CÂU</td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center text-blue-600 text-xl">{totals.tnkq_choice.total}</td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center text-purple-600 text-xl">{totals.tnkq_tf.total}</td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center text-emerald-600 text-xl">{totals.tnkq_short.total}</td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center text-orange-600 text-xl">{totals.essay.total}</td>
              <td className="border border-slate-200 p-2 text-center text-slate-900 text-xl">{totals.knowing}</td>
              <td className="border border-slate-200 p-2 text-center text-slate-900 text-xl">{totals.understanding}</td>
              <td className="border border-slate-200 p-2 text-center text-slate-900 text-xl">{totals.applying}</td>
              <td className="border border-slate-200 p-2 text-center text-red-600 text-xl">100%</td>
            </tr>
            <tr className="text-xs text-slate-500">
              <td colSpan={3} className="border border-slate-200 p-2 text-center uppercase">TỔNG ĐIỂM</td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center">
                <span className="text-blue-700 font-bold">{totals.tnkq_choice.points.toFixed(2)}</span>
              </td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center">
                <span className="text-purple-700 font-bold">{totals.tnkq_tf.points.toFixed(2)}</span>
              </td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center">
                <span className="text-emerald-700 font-bold">{totals.tnkq_short.points.toFixed(2)}</span>
              </td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center">
                <span className="text-orange-700 font-bold">{totals.essay.points.toFixed(2)}</span>
              </td>
              <td className="border border-slate-200 p-2 text-center">{totals.knowingPoints.toFixed(2)}</td>
              <td className="border border-slate-200 p-2 text-center">{totals.understandingPoints.toFixed(2)}</td>
              <td className="border border-slate-200 p-2 text-center">{totals.applyingPoints.toFixed(2)}</td>
              <td className="border border-slate-200 p-2 text-center text-slate-900 font-black">{totals.totalPoints.toFixed(2)}</td>
            </tr>
            <tr className="text-xs text-slate-500">
              <td colSpan={3} className="border border-slate-200 p-2 text-center uppercase">TỈ LỆ %</td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center">
                <span className="text-blue-700 font-bold">{Math.round((totals.tnkq_choice.points / 10) * 100)}%</span>
              </td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center">
                <span className="text-purple-700 font-bold">{Math.round((totals.tnkq_tf.points / 10) * 100)}%</span>
              </td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center">
                <span className="text-emerald-700 font-bold">{Math.round((totals.tnkq_short.points / 10) * 100)}%</span>
              </td>
              <td colSpan={3} className="border border-slate-200 p-2 text-center">
                <span className="text-orange-700 font-bold">{Math.round((totals.essay.points / 10) * 100)}%</span>
              </td>
              <td className="border border-slate-200 p-2 text-center">{Math.round((totals.knowingPoints / 10) * 100)}%</td>
              <td className="border border-slate-200 p-2 text-center">{Math.round((totals.understandingPoints / 10) * 100)}%</td>
              <td className="border border-slate-200 p-2 text-center">{Math.round((totals.applyingPoints / 10) * 100)}%</td>
              <td className="border border-slate-200 p-2 text-center text-slate-900 font-black">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default MatrixEditor;
