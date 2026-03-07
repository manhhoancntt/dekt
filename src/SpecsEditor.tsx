import React from 'react';
import { SpecItem, MatrixData } from './types';
import { FileDown, Settings2, RotateCcw } from 'lucide-react';
import { saveAs } from 'file-saver';
import { 
  Document, 
  Packer, 
  Paragraph, 
  Table, 
  TableCell, 
  TableRow, 
  TextRun, 
  WidthType, 
  AlignmentType, 
  VerticalAlign,
  BorderStyle,
  Header,
  Footer
} from 'docx';

interface SpecsEditorProps {
  data: SpecItem[];
  matrixData: MatrixData;
  config: {
    grade: string;
    semester: string;
    duration: number;
  };
  onReset: () => void;
}

const SpecsEditor: React.FC<SpecsEditorProps> = ({ data, matrixData, config, onReset }) => {
  const exportToWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "BẢN ĐẶC TẢ ĐỀ KIỂM TRA", bold: true, size: 28 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({ text: `ĐỀ KIỂM TRA ${config.semester.toUpperCase()} - MÔN TIN - LỚP ${config.grade} (${config.duration} PHÚT)`, bold: true, size: 20 }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header rows
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "TT", bold: true })], alignment: AlignmentType.CENTER })], 
                    verticalAlign: VerticalAlign.CENTER, 
                    rowSpan: 3,
                    shading: { fill: "F1F5F9" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "CHƯƠNG/CHỦ ĐỀ", bold: true })], alignment: AlignmentType.CENTER })], 
                    verticalAlign: VerticalAlign.CENTER, 
                    rowSpan: 3,
                    shading: { fill: "F1F5F9" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "NỘI DUNG/ ĐƠN VỊ KIẾN THỨC", bold: true })], alignment: AlignmentType.CENTER })], 
                    verticalAlign: VerticalAlign.CENTER, 
                    rowSpan: 3,
                    shading: { fill: "F1F5F9" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "MỨC ĐỘ ĐÁNH GIÁ / YÊU CẦU CẦN ĐẠT", bold: true })], alignment: AlignmentType.CENTER })], 
                    verticalAlign: VerticalAlign.CENTER, 
                    rowSpan: 3,
                    shading: { fill: "F1F5F9" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "SỐ CÂU HỎI THEO MỨC ĐỘ NHẬN THỨC", bold: true })], alignment: AlignmentType.CENTER })], 
                    columnSpan: 11,
                    shading: { fill: "F1F5F9" }
                  }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "TNKQ (NHIỀU LỰA CHỌN)", bold: true })], alignment: AlignmentType.CENTER })], 
                    columnSpan: 3,
                    shading: { fill: "F1F5F9" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "TNKQ (ĐÚNG - SAI)", bold: true })], alignment: AlignmentType.CENTER })], 
                    columnSpan: 3,
                    shading: { fill: "F1F5F9" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "TNKQ (TRẢ LỜI NGẮN)", bold: true })], alignment: AlignmentType.CENTER })], 
                    columnSpan: 3,
                    shading: { fill: "F1F5F9" }
                  }),
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "TỰ LUẬN", bold: true })], alignment: AlignmentType.CENTER })], 
                    columnSpan: 2,
                    shading: { fill: "F1F5F9" }
                  }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "BIẾT", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "HIỂU", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "VD", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "BIẾT", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "HIỂU", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "VD", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "BIẾT", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "HIỂU", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "VD", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "VD", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "VDC", bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                ]
              }),
              // Data rows
              ...data.flatMap((item, idx) => {
                return item.levels.map((level, lIdx) => {
                  const cells = [];
                  if (lIdx === 0) {
                    cells.push(new TableCell({ children: [new Paragraph({ text: (idx + 1).toString(), alignment: AlignmentType.CENTER })], rowSpan: item.levels.length, verticalAlign: VerticalAlign.CENTER }));
                    cells.push(new TableCell({ children: [new Paragraph({ text: item.topicTitle })], rowSpan: item.levels.length, verticalAlign: VerticalAlign.CENTER }));
                    cells.push(new TableCell({ children: [new Paragraph({ text: item.contentTitle })], rowSpan: item.levels.length, verticalAlign: VerticalAlign.CENTER }));
                  }
                  
                  cells.push(new TableCell({ 
                    children: [
                      new Paragraph({ children: [new TextRun({ text: level.levelName + ":", bold: true })] }),
                      ...level.requirements.map(req => new Paragraph({ text: "- " + req, indent: { left: 240 } }))
                    ] 
                  }));

                  const counts = level.questionCounts;
                  const types = ['tnkq_choice', 'tnkq_tf', 'tnkq_short'] as const;
                  types.forEach(type => {
                    ['knowing', 'understanding', 'applying'].forEach(l => {
                      const isMatch = (l === 'knowing' && level.levelName.includes('Nhận biết')) ||
                                      (l === 'understanding' && level.levelName.includes('Thông hiểu')) ||
                                      (l === 'applying' && (level.levelName.includes('Vận dụng') || level.levelName.includes('Vận dụng cao')));
                      const val = isMatch ? counts[type] : 0;
                      cells.push(new TableCell({ children: [new Paragraph({ text: val > 0 ? val.toString() : "", alignment: AlignmentType.CENTER })] }));
                    });
                  });

                  // Essay
                  ['applying', 'applying_high'].forEach(l => {
                    const isMatch = (l === 'applying' && level.levelName === 'Vận dụng') ||
                                    (l === 'applying_high' && level.levelName === 'Vận dụng cao');
                    const val = isMatch ? counts.essay : 0;
                    cells.push(new TableCell({ children: [new Paragraph({ text: val > 0 ? val.toString() : "", alignment: AlignmentType.CENTER })] }));
                  });

                  return new TableRow({ children: cells });
                });
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "TỔNG SỐ CÂU", bold: true })], alignment: AlignmentType.CENTER })], 
                    columnSpan: 4,
                    shading: { fill: "F1F5F9" }
                  }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_choice.knowing.toString(), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_choice.understanding.toString(), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_choice.applying.toString(), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_tf.knowing.toString(), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_tf.understanding.toString(), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_tf.applying.toString(), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_short.knowing.toString(), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_short.understanding.toString(), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_short.applying.toString(), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.essay.applying.toString(), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.essay.applying_high.toString(), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ 
                    children: [new Paragraph({ children: [new TextRun({ text: "TỔNG ĐIỂM", bold: true })], alignment: AlignmentType.CENTER })], 
                    columnSpan: 4,
                    shading: { fill: "F1F5F9" }
                  }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_choice.points.knowing.toFixed(2), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_choice.points.understanding.toFixed(2), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_choice.points.applying.toFixed(2), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_tf.points.knowing.toFixed(2), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_tf.points.understanding.toFixed(2), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_tf.points.applying.toFixed(2), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_short.points.knowing.toFixed(2), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_short.points.understanding.toFixed(2), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.tnkq_short.points.applying.toFixed(2), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.essay.points.applying.toFixed(2), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: totals.essay.points.applying_high.toFixed(2), bold: true })], alignment: AlignmentType.CENTER })], shading: { fill: "F1F5F9" } }),
                ]
              })
            ]
          })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Ban_dac_ta_de_kiem_tra_${config.grade}_${config.semester}.docx`);
  };

  // Calculate spans for topic/content titles
  const topicSpans = React.useMemo(() => {
    const spans: number[] = [];
    data.forEach(item => {
      spans.push(item.levels.length);
      for (let i = 1; i < item.levels.length; i++) {
        spans.push(0);
      }
    });
    return spans;
  }, [data]);

  // Flatten data for easier rendering
  const flatRows = React.useMemo(() => {
    return data.flatMap((item, idx) => {
      return item.levels.map((level, lIdx) => ({
        ...level,
        topicTitle: item.topicTitle,
        contentTitle: item.contentTitle,
        isFirstInTopic: lIdx === 0,
        topicIdx: idx
      }));
    });
  }, [data]);

  const totals = React.useMemo(() => {
    const res = {
      tnkq_choice: { knowing: 0, understanding: 0, applying: 0, points: { knowing: 0, understanding: 0, applying: 0 } },
      tnkq_tf: { knowing: 0, understanding: 0, applying: 0, points: { knowing: 0, understanding: 0, applying: 0 } },
      tnkq_short: { knowing: 0, understanding: 0, applying: 0, points: { knowing: 0, understanding: 0, applying: 0 } },
      essay: { applying: 0, applying_high: 0, points: { applying: 0, applying_high: 0 } }
    };

    const points = matrixData.config.pointsPerQuestion;

    data.forEach(item => {
      // Find matching row in matrixData to get potential point overrides
      const matrixRow = matrixData.rows.find(r => r.topicTitle === item.topicTitle && r.contentTitle === item.contentTitle);

      item.levels.forEach(level => {
        const counts = level.questionCounts;
        const name = level.levelName;

        const getPoint = (type: 'tnkq_choice' | 'tnkq_tf' | 'tnkq_short' | 'essay', lvl: 'knowing' | 'understanding' | 'applying') => {
          return matrixRow?.points?.[type]?.[lvl] ?? points[type];
        };

        if (name.includes('Nhận biết')) {
          res.tnkq_choice.knowing += counts.tnkq_choice;
          res.tnkq_tf.knowing += counts.tnkq_tf;
          res.tnkq_short.knowing += counts.tnkq_short;

          res.tnkq_choice.points.knowing += counts.tnkq_choice * getPoint('tnkq_choice', 'knowing');
          res.tnkq_tf.points.knowing += counts.tnkq_tf * getPoint('tnkq_tf', 'knowing');
          res.tnkq_short.points.knowing += counts.tnkq_short * getPoint('tnkq_short', 'knowing');
        } else if (name.includes('Thông hiểu')) {
          res.tnkq_choice.understanding += counts.tnkq_choice;
          res.tnkq_tf.understanding += counts.tnkq_tf;
          res.tnkq_short.understanding += counts.tnkq_short;

          res.tnkq_choice.points.understanding += counts.tnkq_choice * getPoint('tnkq_choice', 'understanding');
          res.tnkq_tf.points.understanding += counts.tnkq_tf * getPoint('tnkq_tf', 'understanding');
          res.tnkq_short.points.understanding += counts.tnkq_short * getPoint('tnkq_short', 'understanding');
        } else if (name === 'Vận dụng') {
          res.tnkq_choice.applying += counts.tnkq_choice;
          res.tnkq_tf.applying += counts.tnkq_tf;
          res.tnkq_short.applying += counts.tnkq_short;
          res.essay.applying += counts.essay;

          res.tnkq_choice.points.applying += counts.tnkq_choice * getPoint('tnkq_choice', 'applying');
          res.tnkq_tf.points.applying += counts.tnkq_tf * getPoint('tnkq_tf', 'applying');
          res.tnkq_short.points.applying += counts.tnkq_short * getPoint('tnkq_short', 'applying');
          res.essay.points.applying += counts.essay * getPoint('essay', 'applying');
        } else if (name === 'Vận dụng cao') {
          res.tnkq_choice.applying += counts.tnkq_choice;
          res.tnkq_tf.applying += counts.tnkq_tf;
          res.tnkq_short.applying += counts.tnkq_short;
          res.essay.applying_high += counts.essay;

          res.tnkq_choice.points.applying += counts.tnkq_choice * getPoint('tnkq_choice', 'applying');
          res.tnkq_tf.points.applying += counts.tnkq_tf * getPoint('tnkq_tf', 'applying');
          res.tnkq_short.points.applying += counts.tnkq_short * getPoint('tnkq_short', 'applying');
          res.essay.points.applying_high += counts.essay * getPoint('essay', 'applying');
        }
      });
    });

    return res;
  }, [data, matrixData]);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Bản Đặc Tả Đề Kiểm Tra</h2>
        <p className="text-sm font-medium text-slate-500 uppercase">
          {config.semester} — Môn Tin — Lớp {config.grade} ({config.duration} phút)
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <button 
          onClick={exportToWord}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all"
        >
          <FileDown size={14} />
          Xuất file Word
        </button>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-lg text-xs font-bold hover:bg-orange-100 transition-all"
        >
          <RotateCcw size={14} />
          Làm lại
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase font-bold">
              <th rowSpan={3} className="border border-slate-200 p-2 w-8">TT</th>
              <th rowSpan={3} className="border border-slate-200 p-2 w-32">Chương/Chủ đề</th>
              <th rowSpan={3} className="border border-slate-200 p-2 w-40">Nội dung/ Đơn vị kiến thức</th>
              <th rowSpan={3} className="border border-slate-200 p-2 min-w-[300px]">Mức độ đánh giá / Yêu cầu cần đạt</th>
              <th colSpan={11} className="border border-slate-200 p-2 bg-blue-50/50">Số câu hỏi theo mức độ nhận thức</th>
            </tr>
            <tr className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px]">
              <th colSpan={3} className="border border-slate-200 p-1 bg-blue-100/30">TNKQ (Nhiều lựa chọn)</th>
              <th colSpan={3} className="border border-slate-200 p-1 bg-purple-100/30">TNKQ (Đúng - Sai)</th>
              <th colSpan={3} className="border border-slate-200 p-1 bg-emerald-100/30">TNKQ (Trả lời ngắn)</th>
              <th colSpan={2} className="border border-slate-200 p-1 bg-orange-100/30">Tự luận</th>
            </tr>
            <tr className="bg-slate-50 text-slate-500 font-bold text-[9px]">
              <th className="border border-slate-200 p-1 w-10">Biết</th>
              <th className="border border-slate-200 p-1 w-10">Hiểu</th>
              <th className="border border-slate-200 p-1 w-10">VD</th>
              <th className="border border-slate-200 p-1 w-10">Biết</th>
              <th className="border border-slate-200 p-1 w-10">Hiểu</th>
              <th className="border border-slate-200 p-1 w-10">VD</th>
              <th className="border border-slate-200 p-1 w-10">Biết</th>
              <th className="border border-slate-200 p-1 w-10">Hiểu</th>
              <th className="border border-slate-200 p-1 w-10">VD</th>
              <th className="border border-slate-200 p-1 w-10">VD</th>
              <th className="border border-slate-200 p-1 w-10">VDC</th>
            </tr>
          </thead>
          <tbody>
            {flatRows.map((row, idx) => {
              const isKnowing = row.levelName.includes('Nhận biết');
              const isUnderstanding = row.levelName.includes('Thông hiểu');
              const isApplying = row.levelName === 'Vận dụng';
              const isApplyingHigh = row.levelName === 'Vận dụng cao';

              return (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  {row.isFirstInTopic && (
                    <>
                      <td rowSpan={topicSpans[idx]} className="border border-slate-200 p-2 text-center text-slate-400 font-medium">
                        {row.topicIdx + 1}
                      </td>
                      <td rowSpan={topicSpans[idx]} className="border border-slate-200 p-2 font-bold text-slate-700 bg-slate-50/30">
                        {row.topicTitle}
                      </td>
                      <td rowSpan={topicSpans[idx]} className="border border-slate-200 p-2 text-slate-600 font-medium">
                        {row.contentTitle}
                      </td>
                    </>
                  )}
                  <td className="border border-slate-200 p-2">
                    <div className="font-bold text-slate-800 mb-1">{row.levelName}:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {row.requirements.map((req, rIdx) => (
                        <li key={rIdx} className="leading-relaxed">{req}</li>
                      ))}
                    </ul>
                  </td>
                  
                  {/* TNKQ Choice */}
                  <td className="border border-slate-200 p-1 text-center font-bold text-blue-600 bg-blue-50/5">
                    {isKnowing && row.questionCounts.tnkq_choice > 0 ? row.questionCounts.tnkq_choice : ""}
                  </td>
                  <td className="border border-slate-200 p-1 text-center font-bold text-blue-600 bg-blue-50/5">
                    {isUnderstanding && row.questionCounts.tnkq_choice > 0 ? row.questionCounts.tnkq_choice : ""}
                  </td>
                  <td className="border border-slate-200 p-1 text-center font-bold text-blue-600 bg-blue-50/5">
                    {(isApplying || isApplyingHigh) && row.questionCounts.tnkq_choice > 0 ? row.questionCounts.tnkq_choice : ""}
                  </td>

                  {/* TNKQ TF */}
                  <td className="border border-slate-200 p-1 text-center font-bold text-purple-600 bg-purple-50/5">
                    {isKnowing && row.questionCounts.tnkq_tf > 0 ? row.questionCounts.tnkq_tf : ""}
                  </td>
                  <td className="border border-slate-200 p-1 text-center font-bold text-purple-600 bg-purple-50/5">
                    {isUnderstanding && row.questionCounts.tnkq_tf > 0 ? row.questionCounts.tnkq_tf : ""}
                  </td>
                  <td className="border border-slate-200 p-1 text-center font-bold text-purple-600 bg-purple-50/5">
                    {(isApplying || isApplyingHigh) && row.questionCounts.tnkq_tf > 0 ? row.questionCounts.tnkq_tf : ""}
                  </td>

                  {/* TNKQ Short */}
                  <td className="border border-slate-200 p-1 text-center font-bold text-emerald-600 bg-emerald-50/5">
                    {isKnowing && row.questionCounts.tnkq_short > 0 ? row.questionCounts.tnkq_short : ""}
                  </td>
                  <td className="border border-slate-200 p-1 text-center font-bold text-emerald-600 bg-emerald-50/5">
                    {isUnderstanding && row.questionCounts.tnkq_short > 0 ? row.questionCounts.tnkq_short : ""}
                  </td>
                  <td className="border border-slate-200 p-1 text-center font-bold text-emerald-600 bg-emerald-50/5">
                    {(isApplying || isApplyingHigh) && row.questionCounts.tnkq_short > 0 ? row.questionCounts.tnkq_short : ""}
                  </td>

                  {/* Essay */}
                  <td className="border border-slate-200 p-1 text-center font-bold text-orange-600 bg-orange-50/5">
                    {isApplying && row.questionCounts.essay > 0 ? row.questionCounts.essay : ""}
                  </td>
                  <td className="border border-slate-200 p-1 text-center font-bold text-orange-600 bg-orange-50/5">
                    {isApplyingHigh && row.questionCounts.essay > 0 ? row.questionCounts.essay : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-100/80 font-black text-[12px]">
            <tr>
              <td colSpan={4} className="border border-slate-200 p-3 text-center uppercase tracking-widest text-slate-800">TỔNG SỐ CÂU</td>
              <td className="border border-slate-200 p-1 text-center text-blue-700">{totals.tnkq_choice.knowing}</td>
              <td className="border border-slate-200 p-1 text-center text-blue-700">{totals.tnkq_choice.understanding}</td>
              <td className="border border-slate-200 p-1 text-center text-blue-700">{totals.tnkq_choice.applying}</td>
              
              <td className="border border-slate-200 p-1 text-center text-purple-700">{totals.tnkq_tf.knowing}</td>
              <td className="border border-slate-200 p-1 text-center text-purple-700">{totals.tnkq_tf.understanding}</td>
              <td className="border border-slate-200 p-1 text-center text-purple-700">{totals.tnkq_tf.applying}</td>

              <td className="border border-slate-200 p-1 text-center text-emerald-700">{totals.tnkq_short.knowing}</td>
              <td className="border border-slate-200 p-1 text-center text-emerald-700">{totals.tnkq_short.understanding}</td>
              <td className="border border-slate-200 p-1 text-center text-emerald-700">{totals.tnkq_short.applying}</td>

              <td className="border border-slate-200 p-1 text-center text-orange-700">{totals.essay.applying}</td>
              <td className="border border-slate-200 p-1 text-center text-orange-700">{totals.essay.applying_high}</td>
            </tr>
            <tr>
              <td colSpan={4} className="border border-slate-200 p-3 text-center uppercase tracking-widest text-slate-800">TỔNG ĐIỂM</td>
              <td className="border border-slate-200 p-1 text-center text-blue-700">{totals.tnkq_choice.points.knowing.toFixed(2)}</td>
              <td className="border border-slate-200 p-1 text-center text-blue-700">{totals.tnkq_choice.points.understanding.toFixed(2)}</td>
              <td className="border border-slate-200 p-1 text-center text-blue-700">{totals.tnkq_choice.points.applying.toFixed(2)}</td>
              
              <td className="border border-slate-200 p-1 text-center text-purple-700">{totals.tnkq_tf.points.knowing.toFixed(2)}</td>
              <td className="border border-slate-200 p-1 text-center text-purple-700">{totals.tnkq_tf.points.understanding.toFixed(2)}</td>
              <td className="border border-slate-200 p-1 text-center text-purple-700">{totals.tnkq_tf.points.applying.toFixed(2)}</td>

              <td className="border border-slate-200 p-1 text-center text-emerald-700">{totals.tnkq_short.points.knowing.toFixed(2)}</td>
              <td className="border border-slate-200 p-1 text-center text-emerald-700">{totals.tnkq_short.points.understanding.toFixed(2)}</td>
              <td className="border border-slate-200 p-1 text-center text-emerald-700">{totals.tnkq_short.points.applying.toFixed(2)}</td>

              <td className="border border-slate-200 p-1 text-center text-orange-700">{totals.essay.points.applying.toFixed(2)}</td>
              <td className="border border-slate-200 p-1 text-center text-orange-700">{totals.essay.points.applying_high.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SpecsEditor;
