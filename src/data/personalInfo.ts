export const personalInfo = {
  name: "Yifei Bao",
  title: "AI / ML Engineer",
  email: "baoyifei@bu.edu",
  location: "Boston, MA",
  avatar: "/avatar-placeholder.png",
  social: {
    linkedin: "https://linkedin.com/in/yifei-bao-mscs",
    github: "https://github.com/spectual",
  },
  background: "A Master's student in Computer Science at Boston University with strong background in AI. Experienced in developing end-to-end AI pipelines, computer vision, and machine learning algorithms.",
  skills: [
    "Python",
    "PyTorch",
    "Machine Learning",
    "LLM Applications (Agent, RAG)",
    "Data Science",
    "Computer Vision",
    "Git",
    "Java",
    "Pandas",
    "NumPy",
    "OpenCV"
  ],
  experience: [
    {
      title: "AI Engineer Intern",
      company: "DIET, Harvard University",
      duration: "Aug 2025 – Present",
      description: "Architected an agentic system and fine-tuned multimodal VLMs for artwork analysis at Harvard Arts Museum.",
    },
    {
      title: "Machine Learning Engineer Intern",
      company: "Institute of Artificial Intelligence, Nanjing Normal University",
      duration: "Aug 2023 – Jun 2024",
      description: "Designed a production-grade computer vision system for RHEED image analysis; led a 6-member team and achieved substantial time and cost savings.",
    }
  ],
  projects: [
    {
      name: "Interactive Artwork Image Analysis Agent",
      description: "Agentic system that orchestrates 20+ V&L models/APIs (Qwen-VL, BLIP-2, GPT-4o, Gemini, YOLOv8) to analyze user-uploaded artwork images, producing structured metadata; reduced cost by 40% and improved speed by 58%.",
      technologies: ["Agentic System", "Qwen-VL", "BLIP-2", "GPT-4o", "Gemini", "YOLOv8"]
    },
    {
      name: "Multimodal VLM Fine-Tuning for Artwork Description",
      description: "Fine-tuned Qwen2.5-VL-7B with LoRA on curated artwork datasets; leveraged ViT and Qwen-VL on 385K+ images to generate 70M+ tags/descriptions using warm-up, cosine LR decay, BF16, and gradient accumulation.",
      technologies: ["Qwen2.5-VL-7B", "LoRA", "SFT", "BF16", "Cosine LR Decay", "Warm-up", "Gradient Accumulation", "ViT"]
    },
    {
      name: "AI Chat Website with RAG System",
      description: "Developed a full-stack AI chat application using React, TypeScript, and OpenAI GPT API. Implemented RAG (Retrieval-Augmented Generation) with ChromaDB vector database, MMR algorithm for diverse retrieval, and deployed on Railway backend with GitHub Pages frontend.",
      technologies: ["React", "TypeScript", "OpenAI API", "RAG", "ChromaDB", "Vector Search", "Full-Stack"]
    },
    {
      name: "Boston Police Department Budget Analysis",
      description: "Performed data cleaning, exploratory data analysis and visualization on BPD budget and payroll records to uncover trends in overtime spending. Built and evaluated machine learning models to predict future overtime expenditures.",
      technologies: ["Data Analysis", "Machine Learning", "Data Visualization", "GitHub"]
    },
    {
      name: "Machine-Vision Based Assistance System",
      description: "Built an accessibility assistance system using YOLO-based object detection and semantic segmentation for blind pathways. Responsible for technical architecture, dataset collection, and model development.",
      technologies: ["YOLO", "Object Detection", "Semantic Segmentation"]
    },
    {
      name: "Patent: Compound Flood Disaster Prediction",
      description: "Developed a system combining NLP, knowledge graphs, and graph-based ML to predict flood disaster distributions. (CNIPA Patent ZL202411718876.X)",
      technologies: ["NLP", "Knowledge Graph", "Graph ML", "Patent"]
    }
  ],
  education: [
    {
      degree: "M.S. in Computer Science",
      school: "Boston University",
      year: "Sep 2024 - Present"
    },
    {
      degree: "B.Eng. in Artificial Intelligence",
      school: "Nanjing Normal University",
      year: "Sep 2020 - Jun 2024"
    }
  ]
};
