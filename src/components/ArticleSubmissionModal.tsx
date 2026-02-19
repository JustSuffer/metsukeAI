
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ArticleSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ArticleSubmissionModal = ({ isOpen, onClose, onSuccess }: ArticleSubmissionModalProps) => {
  // const { t } = useTranslation(); // Removed unused
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    content: "",
    category: "Genel",
    tags: "",
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "pdf") => {
    if (e.target.files && e.target.files[0]) {
      if (type === "image") setCoverImage(e.target.files[0]);
      else setPdfFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Makale paylaşmak için giriş yapmalısınız.");
        return;
      }

      let coverImageUrl = null;
      let pdfUrl = null;

      // Upload files if they exist
      if (coverImage) {
        try {
             coverImageUrl = await uploadFile(coverImage, "article_assets");
        } catch (uploadError: any) {
            console.error("Image upload failed", uploadError);
            toast.error("Resim yüklenirken hata oluştu: " + uploadError.message);
            setLoading(false);
            return;
        }
      }

      if (pdfFile) {
        try {
            pdfUrl = await uploadFile(pdfFile, "article_assets");
        } catch (uploadError: any) {
             console.error("PDF upload failed", uploadError);
             toast.error("PDF yüklenirken hata oluştu: " + uploadError.message);
             setLoading(false);
             return;
        }
      }
      
      const slug = formData.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "") + "-" + Math.random().toString(36).substring(2, 7);

      const { error } = await supabase.from("community_articles").insert({
        author_id: user.id,
        title: formData.title,
        abstract: formData.abstract,
        content: formData.content,
        category: formData.category,
        tags: formData.tags.split(",").map(tag => tag.trim()), 
        slug: slug,
        cover_image_url: coverImageUrl,
        pdf_url: pdfUrl,
        status: "published", 
      });

      if (error) throw error;

      toast.success("Makaleniz başarıyla yayınlandı!");
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        title: "",
        abstract: "",
        content: "",
        category: "Genel",
        tags: "",
      });
      setCoverImage(null);
      setPdfFile(null);

    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Makale yayınlanırken bir hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a0505] border-2 border-primary/50 rounded-xl shadow-2xl relative shadow-primary/20"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-serif font-bold text-white mb-6">Makale Oluştur</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Başlık</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-gray-600"
                    placeholder="Makalenizin çarpıcı başlığı..."
                    required
                    minLength={5}
                  />
                </div>

                {/* Abstract */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Özet (Abstract)</label>
                  <textarea
                    name="abstract"
                    value={formData.abstract}
                    onChange={handleInputChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all h-24 placeholder:text-gray-600 resize-none"
                    placeholder="Makalenizin kısa bir özeti..."
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">{formData.abstract.length}/500</div>
                </div>

                {/* Grid for Category & Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all [&>option]:bg-zinc-900"
                        >
                            <option value="Genel">Genel</option>
                            <option value="Yazılım">Yazılım</option>
                            <option value="Mekatronik">Mekatronik</option>
                            <option value="Yapay Zeka">Yapay Zeka</option>
                            <option value="Tasarım">Tasarım</option>
                            <option value="Felsefe">Felsefe</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Kapak Görseli</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "image")}
                                className="hidden"
                                id="cover-upload"
                            />
                            <label
                                htmlFor="cover-upload"
                                className="flex items-center justify-center w-full p-3 bg-black/20 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors text-sm text-gray-400 border-dashed"
                            >
                                <ImageIcon className="w-4 h-4 mr-2" />
                                {coverImage ? coverImage.name : "Görsel Seç"}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">İçerik</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all h-60 placeholder:text-gray-600 font-mono text-sm"
                    placeholder="Makale içeriğinizi buraya yazın (Markdown destekler)..."
                    required
                  />
                </div>

                {/* Tags & PDF */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Etiketler (Virgül ile ayırın)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-gray-600"
                            placeholder="react, ai, teknoloji..."
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">PDF / Döküman</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleFileChange(e, "pdf")}
                                className="hidden"
                                id="pdf-upload"
                            />
                            <label
                                htmlFor="pdf-upload"
                                className="flex items-center justify-center w-full p-3 bg-black/20 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors text-sm text-gray-400 border-dashed"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                {pdfFile ? pdfFile.name : "PDF Yükle"}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Yayınlanıyor...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Makaleyi Yayınla
                        </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ArticleSubmissionModal;
