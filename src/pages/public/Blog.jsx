import { useState, useMemo } from "react";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import { Search, Calendar, User, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const PUBLIC_BLOGS = [
  {
    id: 1,
    title: "10 AI Marketing Trends That Will Dominate in 2026",
    excerpt: "Discover how machine learning, automated copywriting, and predictive analytics are reshaping the modern marketing landscape.",
    category: "AI & Marketing",
    author: "Elena Rostov",
    date: "July 12, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "The Ultimate Guide to Content Repurposing for High Engagement",
    excerpt: "Stop creating content from scratch. Learn how to convert one blog post into an X thread, a newsletter, and multiple social media captions.",
    category: "Social Media",
    author: "Marc Jacobs",
    date: "July 08, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Understanding Keyword Density and SEO Metrics in 2026",
    excerpt: "Search engine algorithms are smarter than ever. Here is how to write authentic articles that naturally optimize keyword density.",
    category: "SEO & Growth",
    author: "Sarah Jenkins",
    date: "July 05, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "How to Build a Seamless Email Marketing Funnel with AI",
    excerpt: "Learn the secrets behind subject lines that get 40%+ open rates and content structures that double your conversion rates.",
    category: "Email Marketing",
    author: "David Lee",
    date: "June 28, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Unlocking Creativity: Working Side-by-Side with AI Assistants",
    excerpt: "AI is not replacing writers; it is empowering them. Learn how leading content houses leverage automation while maintaining human voice.",
    category: "AI & Marketing",
    author: "Elena Rostov",
    date: "June 22, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "5 Copywriting Frameworks That Drive Conversions Fast",
    excerpt: "From AIDA to PAS, explore the psychological models behind high-converting ad copies and landing page copy frameworks.",
    category: "SEO & Growth",
    author: "Marc Jacobs",
    date: "June 18, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop"
  }
];

const CATEGORIES = ["All", "AI & Marketing", "Social Media", "SEO & Growth", "Email Marketing"];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBlogs = useMemo(() => {
    return PUBLIC_BLOGS.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#017A85] to-[#02A3B1] text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            Knowledge Base
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            The AI Content Machine Blog
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
            Stay up to date with the latest strategies, case studies, and insights in AI-assisted content creation and automated marketing.
          </p>
        </div>
      </section>

      {/* Filters and Search Section */}
      <section className="py-8 bg-white border-b border-gray-150 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#02A3B1] text-sm"
            />
          </div>

          {/* Categories Tabs */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 justify-start md:justify-end">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border shrink-0 transition-colors ${
                  activeCategory === cat
                    ? "bg-[#02A3B1] text-white border-[#02A3B1]"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Cards List */}
      <section className="py-16 px-6 flex-1">
        <div className="max-w-7xl mx-auto">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm">
              <h3 className="text-xl font-bold text-[#1A1A2E]">No Articles Found</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                We couldn't find any articles matching your search query. Try switching categories or refining your keyword.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map(post => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Card Image */}
                  <div className="h-48 overflow-hidden bg-gray-100 relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-4 left-4 bg-white/95 text-[#017A85] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm">
                      {post.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1A1A2E] leading-snug hover:text-[#02A3B1] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#E0F7FA] text-[#02A3B1] flex items-center justify-center font-bold text-xs">
                          {post.author.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-xs font-semibold text-[#1A1A2E]">{post.author}</span>
                      </div>
                      
                      <Link
                        to="/login"
                        className="text-[#02A3B1] hover:text-[#017A85] text-xs font-bold flex items-center gap-1 hover:underline"
                      >
                        Read Article <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-[#1A1A2E] text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">Write Articles Like These in 2 Minutes</h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Harness the power of high-quality AI models to plan keywords, outline blogs, maintain SEO compliance, and schedule across accounts.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-[#02A3B1] hover:bg-[#017A85] text-white font-semibold px-8 py-3 rounded-xl transition duration-200"
          >
            Start Writing Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
