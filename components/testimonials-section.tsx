
import { Quote } from "lucide-react"

const testimonials = [
    {
        id: 1,
        content: "আমি এখান থেকে হিজাব কিনে খুব খুশি। কাপড়ের মান অসাধারণ এবং ডেলিভারিও খুব ফাস্ট ছিল।",
        author: "নুসরাত জাহান",
        role: "ঢাকা",
    },
    {
        id: 2,
        content: "আবায়ার ফিটিং এবং ডিজাইন দুটোই আমার খুব পছন্দ হয়েছে। ইনশাআল্লাহ আবার অর্ডার করবো।",
        author: "ফারিহা ইসলাম",
        role: "চট্টগ্রাম",
    },
    {
        id: 3,
        content: "অনলাইনে কেনাকাটায় আমি সচরাচর ভরসা পাই না, কিন্তু এদের সার্ভিস আমাকে মুগ্ধ করেছে।",
        author: "সাদিয়া আক্তার",
        role: "সিলেট",
    },
]

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-stone-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <Quote className="h-10 w-10 text-primary/20 mx-auto mb-4" />
                    <h2 className="text-4xl font-serif font-medium mb-4">গ্রাহকদের মতামত</h2>
                    <p className="text-muted-foreground">
                        আমাদের সম্মানিত গ্রাহকরা আমাদের সম্পর্কে কী বলছেন জানুন।
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/50 text-center"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-lg">★</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-lg text-muted-foreground italic mb-8 leading-relaxed">
                                "{testimonial.content}"
                            </p>
                            <div>
                                <h4 className="font-semibold text-foreground">{testimonial.author}</h4>
                                <p className="text-sm text-primary/80">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
