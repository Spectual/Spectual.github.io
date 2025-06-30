import json
import chromadb
from chromadb.config import Settings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.schema import Document
from pathlib import Path
import os
from typing import List, Dict, Any

class RAGSystem:
    def __init__(self, openai_api_key: str, collection_name: str = "personal_data"):
        """
        Initialize RAG system
        
        Args:
            openai_api_key: OpenAI API key
            collection_name: ChromaDB collection name
        """
        self.openai_api_key = openai_api_key
        self.collection_name = collection_name
        
        # Initialize OpenAI embeddings
        self.embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
        
        # Initialize ChromaDB
        self.chroma_client = chromadb.PersistentClient(
            path="./chroma_db",
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Initialize text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\\n\\n", "\\n", ".", "!", "?", "。", "！", "？"]
        )
        
        # Initialize vector database and summary text
        self.vectorstore = None
        self.profile_summary = ""
        self.build_vectorstore()
        
    def load_personal_data(self) -> Dict[str, Any]:
        """Load personal data from JSON file"""
        data_file = Path(__file__).parent / 'personal_data.json'
        if data_file.exists():
            with open(data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            return self._get_default_data()
    
    def _get_default_data(self) -> Dict[str, Any]:
        """Get default data structure"""
        return {
            "basic": {
                "name": "Your Name",
                "title": "Your Title",
                "email": "your.email@example.com",
                "location": "Your Location",
                "summary": "Your professional summary here"
            },
            "skills": {
                "programmingLanguages": [],
                "mlFrameworks": [],
                "cloudPlatforms": [],
                "tools": [],
                "specialties": []
            },
            "experience": [],
            "projects": [],
            "education": [],
            "certifications": [],
            "interests": [],
            "careerGoals": ""
        }
    
    def _generate_summary_text(self, data: Dict[str, Any]) -> str:
        """Generates a high-level summary string from the data."""
        summary_parts = [
            f"This is a summary of {data['basic']['name']}'s professional profile.",
            f"Full Name: {data['basic']['name']}",
            f"Current Title: {data['basic']['title']}"
        ]
        
        experience_list = data.get('experience', [])
        summary_parts.append(f"There are {len(experience_list)} work experiences listed.")
        if experience_list:
            company_names = [exp.get('company', 'N/A') for exp in experience_list]
            summary_parts.append(f"Companies worked at include: {', '.join(company_names)}.")

        projects_list = data.get('projects', [])
        summary_parts.append(f"There are {len(projects_list)} projects listed.")
        if projects_list:
            project_names = [proj.get('name', 'N/A') for proj in projects_list]
            summary_parts.append(f"Project names include: {', '.join(project_names)}.")

        skills_dict = data.get('skills', {})
        if skills_dict:
            summary_parts.append("Key skills include:")
            for category, skills in skills_dict.items():
                if isinstance(skills, list):
                    summary_parts.append(f"- {category.title()}: {', '.join(skills)}")
                else:
                    summary_parts.append(f"- {category.title()}: {skills}")
        
        education_list = data.get('education', [])
        if education_list:
            degrees = [edu.get('degree', 'N/A') for edu in education_list]
            summary_parts.append(f"Education includes degrees such as: {', '.join(degrees)}.")
            
        return "\\n".join(summary_parts)
    
    def _create_documents_from_data(self, data: Dict[str, Any]) -> List[Document]:
        """
        Creates a list of atomic, distinct documents from the personal data.
        Each project, experience, and other major section becomes its own document,
        preventing content overlap and duplication.
        """
        documents = []
        
        # Basic Info as a single document
        basic_info_parts = [
            f"Name: {data['basic']['name']}",
            f"Title: {data['basic']['title']}",
            f"Email: {data['basic']['email']}",
            f"Location: {data['basic']['location']}",
            f"Summary: {data['basic']['summary']}"
        ]
        documents.append(Document(page_content="\\n".join(basic_info_parts), metadata={"type": "basic_info"}))
        
        # All Skills as a single document
        skills_parts = []
        if 'skills' in data and data['skills']:
            skills_parts.append("Skills Summary:")
            for key, value in data['skills'].items():
                if isinstance(value, list):
                    skills_parts.append(f"- {key.replace('_', ' ').title()}: {', '.join(value)}")
                else:
                    skills_parts.append(f"- {key.replace('_', ' ').title()}: {value}")
        if skills_parts:
            documents.append(Document(page_content="\\n".join(skills_parts), metadata={"type": "skills"}))
        
        # Each Work Experience as a separate document
        for i, exp in enumerate(data.get('experience', [])):
            exp_content = f"""Position: {exp.get('title', 'N/A')} at {exp.get('company', 'N/A')} ({exp.get('duration', 'N/A')}).
Responsibilities: {'; '.join(exp.get('responsibilities', []))}"""
            documents.append(Document(page_content=exp_content, metadata={"type": "experience", "company": exp.get('company', 'N/A')}))
        
        # Each Project as a separate document
        for i, proj in enumerate(data.get('projects', [])):
            proj_content = f"""Project: {proj.get('name', 'N/A')}.
Role: {proj.get('role', 'N/A')}.
Description: {proj.get('description', 'N/A')}
Technologies used: {', '.join(proj.get('technologies', []))}"""
            documents.append(Document(page_content=proj_content, metadata={"type": "project", "name": proj.get('name', 'N/A')}))
        
        # Each Education entry as a separate document
        for i, edu in enumerate(data.get('education', [])):
            edu_content = f"""Degree: {edu.get('degree', 'N/A')} from {edu.get('school', 'N/A')} ({edu.get('year', 'N/A')}).
GPA: {edu.get('gpa', 'N/A')}.
Relevant Courses: {', '.join(edu.get('relevantCourses', []))}"""
            documents.append(Document(page_content=edu_content, metadata={"type": "education", "school": edu.get('school', 'N/A')}))
        
        # Other sections as single, combined documents
        if data.get('publications'):
            pub_titles = [f"'{p.get('title', 'N/A')}'" for p in data.get('publications', [])]
            documents.append(Document(page_content=f"Authored publications including: {', '.join(pub_titles)}", metadata={"type": "publications"}))
        
        if data.get('patents'):
            patent_titles = [f"'{p.get('title', 'N/A')}'" for p in data.get('patents', [])]
            documents.append(Document(page_content=f"Holds patents including: {', '.join(patent_titles)}", metadata={"type": "patents"}))

        if data.get('certifications'):
            documents.append(Document(page_content=f"Certifications: {', '.join(data.get('certifications', []))}", metadata={"type": "certifications"}))
        
        if data.get('honors'):
            documents.append(Document(page_content=f"Honors and Awards: {', '.join(data.get('honors', []))}", metadata={"type": "honors"}))
        
        return documents
    
    def build_vectorstore(self):
        """Builds the vector database and generates the summary text."""
        print("🔧 Building vector database...")
        
        data = self.load_personal_data()
        
        # 1. Generate and store the summary text as an instance variable
        self.profile_summary = self._generate_summary_text(data)
        print("✅ Profile summary generated and cached.")

        # 2. Create a list of atomic documents. The text splitter will NOT be used.
        documents = self._create_documents_from_data(data)
        
        print(f"📄 Created {len(documents)} atomic documents to be ingested.")
        
        # 3. Create the vector database directly from the atomic documents.
        self.vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            collection_name=self.collection_name,
            client=self.chroma_client
        )
        
        print("✅ Vector database built successfully!")
    
    def get_summary_document(self) -> str:
        """
        Returns the cached high-level summary text.
        """
        return self.profile_summary
    
    def search_relevant_context(self, query: str, k: int = 5) -> str:
        """
        Search for relevant context using Maximal Marginal Relevance (MMR)
        to ensure diversity in the retrieved documents.
        
        Args:
            query: User query
            k: Number of relevant documents to return
            
        Returns:
            Relevant context string
        """
        if not self.vectorstore:
            raise ValueError("Vector database not built. Call build_vectorstore() first.")
        
        # Use MMR to fetch diverse and relevant documents.
        # The summary is no longer in the DB, so no filter is needed.
        retriever = self.vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={'k': k, 'fetch_k': 20, 'lambda_mult': 0.25}
        )
        docs = retriever.get_relevant_documents(query)
        
        # --- Foolproof De-duplication Step ---
        unique_docs = []
        seen_content = set()
        for doc in docs:
            if doc.page_content not in seen_content:
                unique_docs.append(doc)
                seen_content.add(doc.page_content)
        
        # Build context from the unique documents
        context_parts = []
        print(f"🔍 Retrieved {len(unique_docs)} unique contexts for the LLM.")
        for i, doc in enumerate(unique_docs, 1):
            context_parts.append(f"Relevant Information {i}:\\n{doc.page_content}")
        
        return "\\n\\n".join(context_parts)
    
    def get_personal_info(self) -> Dict[str, Any]:
        """Get basic personal information for system prompt"""
        data = self.load_personal_data()
        return {
            "name": data['basic']['name'],
            "title": data['basic']['title']
        } 