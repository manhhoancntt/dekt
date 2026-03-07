import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateAssessmentContent = async (
  type: "matrix" | "specs" | "test",
  config: {
    grade: string;
    semester: string;
    topics: string;
    ratio: string;
    levels: string;
    duration: string;
    matrixData?: any;
  }
) => {
  const model = "gemini-3.1-pro-preview";

  const systemInstructions = `Bạn là một Chuyên gia Khảo thí và Đánh giá Giáo dục, am hiểu sâu sắc Chương trình GDPT 2018 môn Tin học và Công văn 7991/BGDĐT.
Nhiệm vụ của bạn là hỗ trợ giáo viên soạn thảo các tài liệu kiểm tra chuẩn quy trình.

QUY TẮC CHUYÊN MÔN:
- Phân chia đúng các Chủ đề (A, B, C, D, E, F, G) theo khối lớp.
- Tuân thủ các mức độ: Nhận biết (Biết), Thông hiểu (Hiểu), Vận dụng (VD), Vận dụng cao (VDC).
- Tỉ lệ định mức câu hỏi: ${config.ratio}.
- Tỉ lệ mức độ nhận thức: ${config.levels}.
- Hình thức: Trắc nghiệm nhiều lựa chọn (TNKQ), Đúng/Sai, Trả lời ngắn và Tự luận.
- Tổng điểm: 10.
- Thời gian làm bài: ${config.duration} phút.`;

  if (type === "matrix") {
    const response = await ai.models.generateContent({
      model,
      contents: [{ 
        parts: [{ 
          text: `Hãy thiết kế MA TRẬN đề kiểm tra môn Tin học lớp ${config.grade}.
Nội dung kiến thức: ${config.topics}.
Yêu cầu:
1. Phân bổ số câu hỏi vào các ô (Biết, Hiểu, VD) cho 4 loại hình: TNKQ (Nhiều lựa chọn), TNKQ (Đúng - Sai), TNKQ (Trả lời ngắn), Tự luận.
2. Đảm bảo tổng điểm là 10.
3. Đảm bảo tỉ lệ định mức ${config.ratio} và tỉ lệ mức độ ${config.levels}.
4. Trong JSON: 
   - 'topicTitle' phải là tên Chương hoặc Chủ đề lớn (ví dụ: Chủ đề A: Máy tính và cộng đồng).
   - 'contentTitle' phải là Nội dung hoặc Đơn vị kiến thức cụ thể trong chủ đề đó.
5. Xuất dữ liệu dưới dạng JSON.` 
        }] 
      }],
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topicTitle: { type: Type.STRING },
                  contentTitle: { type: Type.STRING },
                  tnkq_choice: {
                    type: Type.OBJECT,
                    properties: {
                      knowing: { type: Type.NUMBER },
                      understanding: { type: Type.NUMBER },
                      applying: { type: Type.NUMBER }
                    }
                  },
                  tnkq_tf: {
                    type: Type.OBJECT,
                    properties: {
                      knowing: { type: Type.NUMBER },
                      understanding: { type: Type.NUMBER },
                      applying: { type: Type.NUMBER }
                    }
                  },
                  tnkq_short: {
                    type: Type.OBJECT,
                    properties: {
                      knowing: { type: Type.NUMBER },
                      understanding: { type: Type.NUMBER },
                      applying: { type: Type.NUMBER }
                    }
                  },
                  essay: {
                    type: Type.OBJECT,
                    properties: {
                      knowing: { type: Type.NUMBER },
                      understanding: { type: Type.NUMBER },
                      applying: { type: Type.NUMBER }
                    }
                  }
                }
              }
            }
          }
        }
      },
    });
    return response.text;
  }

  const specsInstructions = systemInstructions + `
YÊU CẦU TRÌNH BÀY:
- Xuất dữ liệu dưới dạng BẢNG (Markdown table) cho Bản đặc tả.
- Nội dung đặc tả phải chi tiết, bám sát yêu cầu cần đạt của chương trình 2018.
- Sử dụng các động từ hành động chuẩn: "Nêu được...", "Giải thích được...", "Thực hiện được...".`;

  const testInstructions = systemInstructions + `
YÊU CẦU TRÌNH BÀY:
- CHỈ hiển thị ĐỀ KIỂM TRA và ĐÁP ÁN (không có lời chào, không có phần giới thiệu).
- Biên soạn đề thi minh họa rõ ràng, khoa học.
- Kèm theo ĐÁP ÁN và HƯỚNG DẪN CHẤM chi tiết.
- PHẦN ĐÁP ÁN PHẢI CÓ GIẢI THÍCH CHI TIẾT cho từng câu hỏi (tại sao chọn đáp án đó, căn cứ vào kiến thức nào).`;

  let prompt = "";
  let currentInstructions = systemInstructions;

  const matrixContext = config.matrixData ? `\nDựa trên MA TRẬN sau đây:\n${JSON.stringify(config.matrixData, null, 2)}` : "";

  if (type === "specs") {
    const response = await ai.models.generateContent({
      model,
      contents: [{
        parts: [{
          text: `Hãy lập BẢN ĐẶC TẢ đề kiểm tra ${config.semester} môn Tin học lớp ${config.grade}.
Nội dung kiến thức: ${config.topics}.
Dựa trên MA TRẬN sau: ${JSON.stringify(config.matrixData)}

YÊU CẦU ĐẶC BIỆT CHO JSON:
1. "topicTitle": Tên chương/chủ đề.
2. "contentTitle": Tên nội dung/đơn vị kiến thức.
3. "levels": Mảng các đối tượng mức độ, mỗi đối tượng gồm:
   - "levelName": "Nhận biết", "Thông hiểu", "Vận dụng" hoặc "Vận dụng cao".
   - "requirements": Danh sách các yêu cầu cần đạt (chuẩn kiến thức kĩ năng).
   - "questionCounts": Số câu hỏi tương ứng cho từng loại (tnkq_choice, tnkq_tf, tnkq_short, essay).
4. Đảm bảo tổng số câu hỏi khớp hoàn toàn với ma trận.`
        }]
      }],
      config: {
        systemInstruction: systemInstructions,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topicTitle: { type: Type.STRING },
              contentTitle: { type: Type.STRING },
              levels: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    levelName: { type: Type.STRING },
                    requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                    questionCounts: {
                      type: Type.OBJECT,
                      properties: {
                        tnkq_choice: { type: Type.NUMBER },
                        tnkq_tf: { type: Type.NUMBER },
                        tnkq_short: { type: Type.NUMBER },
                        essay: { type: Type.NUMBER }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
    });
    return response.text;
  }
    currentInstructions = testInstructions;
    prompt = `Hãy biên soạn ĐỀ KIỂM TRA MINH HỌA ${config.semester} môn Tin học lớp ${config.grade} dựa trên ma trận và đặc tả đã thiết kế.
Nội dung kiến thức: ${config.topics}.
Yêu cầu:
1. Đề gồm 2 phần: I. TRẮC NGHIỆM và II. TỰ LUẬN. Tổng điểm 10.
2. Câu hỏi phải rõ ràng, bám sát thực tế.
3. PHẦN ĐÁP ÁN: Phải bao gồm bảng đáp án trắc nghiệm và lời giải chi tiết cho tự luận. 
4. ĐẶC BIỆT: Với mỗi câu hỏi trắc nghiệm, phải có phần "Giải thích chi tiết" đi kèm trong bảng đáp án hoặc ngay sau đáp án.
${matrixContext}`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      systemInstruction: currentInstructions,
      temperature: 0.7,
    },
  });

  return response.text;
};
