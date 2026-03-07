export interface SubItem {
  id: string;
  title: string;
}

export interface Topic {
  id: string;
  grade: string;
  title: string;
  description: string;
  subItems: SubItem[];
}

export const TOPICS_DATA: Topic[] = [
  // Lớp 6
  { 
    id: '6-a', 
    grade: '6', 
    title: 'Chủ đề A: Máy tính và cộng đồng', 
    description: 'Thông tin và dữ liệu; Biểu diễn thông tin và lưu trữ dữ liệu.',
    subItems: [
      { id: '6-a-1', title: 'Thông tin và dữ liệu' },
      { id: '6-a-2', title: 'Biểu diễn thông tin và lưu trữ dữ liệu trong máy tính' }
    ]
  },
  { 
    id: '6-b', 
    grade: '6', 
    title: 'Chủ đề B: Mạng máy tính và Internet', 
    description: 'Giới thiệu về mạng máy tính và Internet.',
    subItems: [
      { id: '6-b-1', title: 'Giới thiệu về mạng máy tính và Internet' }
    ]
  },
  { 
    id: '6-c', 
    grade: '6', 
    title: 'Chủ đề C: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin', 
    description: 'WWW, thư điện tử và công cụ tìm kiếm.',
    subItems: [
      { id: '6-c-1', title: 'World Wide Web, thư điện tử và công cụ tìm kiếm thông tin' }
    ]
  },
  { 
    id: '6-d', 
    grade: '6', 
    title: 'Chủ đề D: Đạo đức, pháp luật và văn hóa trong môi trường số', 
    description: 'Đề phòng một số tác hại khi tham gia Internet.',
    subItems: [
      { id: '6-d-1', title: 'Đề phòng một số tác hại khi tham gia Internet' }
    ]
  },
  { 
    id: '6-e', 
    grade: '6', 
    title: 'Chủ đề E: Ứng dụng tin học', 
    description: 'Soạn thảo văn bản; Sơ đồ tư duy.',
    subItems: [
      { id: '6-e-1', title: 'Soạn thảo văn bản cơ bản' },
      { id: '6-e-2', title: 'Sơ đồ tư duy và phần mềm sơ đồ tư duy' }
    ]
  },
  { 
    id: '6-f', 
    grade: '6', 
    title: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính', 
    description: 'Khái niệm thuật toán và biểu diễn thuật toán.',
    subItems: [
      { id: '6-f-1', title: 'Khái niệm thuật toán và biểu diễn thuật toán' }
    ]
  },

  // Lớp 7
  { 
    id: '7-a', 
    grade: '7', 
    title: 'Chủ đề A: Máy tính và cộng đồng', 
    description: 'Thành phần máy tính; Hệ điều hành và phần mềm ứng dụng.',
    subItems: [
      { id: '7-a-1', title: 'Sơ lược về các thành phần của máy tính' },
      { id: '7-a-2', title: 'Khái niệm hệ điều hành và phần mềm ứng dụng' }
    ]
  },
  { 
    id: '7-c', 
    grade: '7', 
    title: 'Chủ đề C: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin', 
    description: 'Mạng xã hội và kênh trao đổi thông tin.',
    subItems: [
      { id: '7-c-1', title: 'Mạng xã hội và một số kênh trao đổi thông tin thông dụng trên Internet' }
    ]
  },
  { 
    id: '7-d', 
    grade: '7', 
    title: 'Chủ đề D: Đạo đức, pháp luật và văn hoá trong môi trường số', 
    description: 'Văn hoá ứng xử qua phương tiện truyền thông số.',
    subItems: [
      { id: '7-d-1', title: 'Văn hoá ứng xử qua phương tiện truyền thông số' }
    ]
  },
  { 
    id: '7-e', 
    grade: '7', 
    title: 'Chủ đề E: Ứng dụng tin học', 
    description: 'Bảng tính điện tử; Phần mềm trình chiếu.',
    subItems: [
      { id: '7-e-1', title: 'Bảng tính điện tử cơ bản' },
      { id: '7-e-2', title: 'Phần mềm trình chiếu cơ bản' }
    ]
  },
  { 
    id: '7-f', 
    grade: '7', 
    title: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính', 
    description: 'Thuật toán sắp xếp và tìm kiếm cơ bản.',
    subItems: [
      { id: '7-f-1', title: 'Một số thuật toán sắp xếp và tìm kiếm cơ bản' }
    ]
  },

  // Lớp 8
  { 
    id: '8-a', 
    grade: '8', 
    title: 'Chủ đề A: Máy tính và cộng đồng', 
    description: 'Thành phần máy tính; Hệ điều hành và phần mềm ứng dụng.',
    subItems: [
      { id: '8-a-1', title: 'Sơ lược về các thành phần của máy tính' },
      { id: '8-a-2', title: 'Khái niệm hệ điều hành và phần mềm ứng dụng' }
    ]
  },
  { 
    id: '8-c', 
    grade: '8', 
    title: 'Chủ đề C: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin', 
    description: 'Mạng xã hội và kênh trao đổi thông tin.',
    subItems: [
      { id: '8-c-1', title: 'Mạng xã hội và một số kênh trao đổi thông tin thông dụng trên Internet' }
    ]
  },
  { 
    id: '8-d', 
    grade: '8', 
    title: 'Chủ đề D: Đạo đức, pháp luật và văn hoá trong môi trường số', 
    description: 'Văn hoá ứng xử qua phương tiện truyền thông số.',
    subItems: [
      { id: '8-d-1', title: 'Văn hoá ứng xử qua phương tiện truyền thông số' }
    ]
  },
  { 
    id: '8-e', 
    grade: '8', 
    title: 'Chủ đề E: Ứng dụng tin học', 
    description: 'Bảng tính điện tử; Phần mềm trình chiếu.',
    subItems: [
      { id: '8-e-1', title: 'Bảng tính điện tử cơ bản' },
      { id: '8-e-2', title: 'Phần mềm trình chiếu cơ bản' }
    ]
  },
  { 
    id: '8-f', 
    grade: '8', 
    title: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính', 
    description: 'Thuật toán sắp xếp và tìm kiếm cơ bản.',
    subItems: [
      { id: '8-f-1', title: 'Một số thuật toán sắp xếp và tìm kiếm cơ bản' }
    ]
  },
  { 
    id: '8-g', 
    grade: '8', 
    title: 'Chủ đề G: Hướng nghiệp với tin học', 
    description: 'Tin học và ngành nghề.',
    subItems: [
      { id: '8-g-1', title: 'Tin học và ngành nghề' }
    ]
  },

  // Lớp 9
  { 
    id: '9-a', 
    grade: '9', 
    title: 'Chủ đề A: Máy tính và cộng đồng', 
    description: 'Vai trò của máy tính trong đời sống.',
    subItems: [
      { id: '9-a-1', title: 'Vai trò của máy tính trong đời sống' }
    ]
  },
  { 
    id: '9-c', 
    grade: '9', 
    title: 'Chủ đề C: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin', 
    description: 'Đánh giá chất lượng thông tin.',
    subItems: [
      { id: '9-c-1', title: 'Đánh giá chất lượng thông tin trong giải quyết vấn đề' }
    ]
  },
  { 
    id: '9-d', 
    grade: '9', 
    title: 'Chủ đề D: Đạo đức, pháp luật và văn hoá trong môi trường số', 
    description: 'Vấn đề pháp lí sử dụng Internet.',
    subItems: [
      { id: '9-d-1', title: 'Một số vấn đề pháp lí về sử dụng dịch vụ Internet' }
    ]
  },
  { 
    id: '9-e', 
    grade: '9', 
    title: 'Chủ đề E: Ứng dụng tin học', 
    description: 'Mô phỏng; Trình bày thông tin; Bảng tính nâng cao; Làm video.',
    subItems: [
      { id: '9-e-1', title: 'Phần mềm mô phỏng và khám phá tri thức' },
      { id: '9-e-2', title: 'Trình bày thông tin trong trao đổi và hợp tác' },
      { id: '9-e-3', title: 'Sử dụng bảng tính điện tử nâng cao' },
      { id: '9-e-4', title: 'Làm quen với phần mềm làm video' }
    ]
  },
  { 
    id: '9-f', 
    grade: '9', 
    title: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính', 
    description: 'Giải bài toán bằng máy tính.',
    subItems: [
      { id: '9-f-1', title: 'Giải bài toán bằng máy tính' }
    ]
  },
  { 
    id: '9-g', 
    grade: '9', 
    title: 'Chủ đề G: Hướng nghiệp với tin học', 
    description: 'Tin học và định hướng nghề nghiệp.',
    subItems: [
      { id: '9-g-1', title: 'Tin học và định hướng nghề nghiệp' }
    ]
  },

  // Lớp 10
  { 
    id: '10-a', 
    grade: '10', 
    title: 'Chủ đề A: Máy tính và xã hội tri thức', 
    description: 'Thiết bị số; Điện toán đám mây; Đa phương tiện.',
    subItems: [
      { id: '10-a-1', title: 'Thế giới thiết bị số' },
      { id: '10-a-2', title: 'Điện toán đám mây' },
      { id: '10-a-3', title: 'Thông tin đa phương tiện' }
    ]
  },
  { 
    id: '10-f', 
    grade: '10', 
    title: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính', 
    description: 'Lập trình Python; Danh sách; Hàm; Module.',
    subItems: [
      { id: '10-f-1', title: 'Lập trình Python cơ bản' },
      { id: '10-f-2', title: 'Kiểu dữ liệu danh sách' },
      { id: '10-f-3', title: 'Hàm và module' }
    ]
  },

  // Lớp 11
  { 
    id: '11-a', 
    grade: '11', 
    title: 'Chủ đề A: Máy tính và xã hội tri thức', 
    description: 'Hệ điều hành; Phần mềm ứng dụng; Lưu trữ dữ liệu.',
    subItems: [
      { id: '11-a-1', title: 'Kiến trúc máy tính và hệ điều hành' },
      { id: '11-a-2', title: 'Phần mềm ứng dụng và dịch vụ mạng' }
    ]
  },
  { 
    id: '11-f', 
    grade: '11', 
    title: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính', 
    description: 'Lập trình Python nâng cao; Cấu trúc dữ liệu; Thuật toán sắp xếp.',
    subItems: [
      { id: '11-f-1', title: 'Lập trình Python nâng cao' },
      { id: '11-f-2', title: 'Cấu trúc dữ liệu mảng và danh sách' },
      { id: '11-f-3', title: 'Thuật toán sắp xếp và tìm kiếm' }
    ]
  },

  // Lớp 12
  { 
    id: '12-a', 
    grade: '12', 
    title: 'Chủ đề A: Máy tính và xã hội tri thức', 
    description: 'Trí tuệ nhân tạo; Internet vạn vật.',
    subItems: [
      { id: '12-a-1', title: 'Giới thiệu về Trí tuệ nhân tạo' },
      { id: '12-a-2', title: 'Internet vạn vật (IoT)' }
    ]
  },
  { 
    id: '12-d', 
    grade: '12', 
    title: 'Chủ đề D: Đạo đức, pháp luật và văn hóa trong môi trường số', 
    description: 'Quyền tác giả; Bảo mật thông tin.',
    subItems: [
      { id: '12-d-1', title: 'Quyền tác giả trong môi trường số' },
      { id: '12-d-2', title: 'Bảo mật và an toàn thông tin' }
    ]
  }
];

