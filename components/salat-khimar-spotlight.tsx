import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Gift, Scissors, Ruler, ShieldCheck } from "lucide-react"

export function SalatKhimarSpotlight() {
    return (
        <section className="py-24 bg-rose-50/50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-100/80 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                    {/* Visual Side */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-2xl relative group">
                             {/* Placeholder for the actual product image. Using a relevant Unsplash image for now */}
                            <img
                                src="https://images.unsplash.com/photo-1710013930415-fac82e4efecb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Muslim Woman Praying"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                                <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full mb-2 uppercase tracking-wide">
                                    হট অফার
                                </span>
                                <h3 className="text-2xl font-serif">সালাত খিমার কালেকশন</h3>
                                <p className="text-white/90 text-sm mt-1">সাথে পাচ্ছেন একটি হাত মোজা ফ্রি!</p>
                            </div>
                        </div>

                        {/* Floating Price Badge */}
                        <div className="absolute -top-6 -right-6 lg:top-10 lg:-right-10 bg-white p-4 rounded-full shadow-xl border border-rose-100 w-32 h-32 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 delay-300">
                            <span className="text-xs text-muted-foreground line-through">১,৩৫০/-</span>
                            <span className="text-2xl font-bold text-primary">১,০৯০/-</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500">ফিক্সড</span>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4 leading-tight">
                                সতর ঢাকা—নামাজের অন্যতম শর্ত
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                নারীর সমস্ত শরীরই সতর। মুসলিম মা-বোনদের জন্য সুন্দর একটি উপহার হচ্ছে এই সালাত খিমার।
                                পবিত্র ওমরা ও হজে নিশ্চিন্তে ব্যবহার করতে পারবেন আমাদের এই খিমারগুলো।
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-100/50 space-y-4">
                            <h3 className="font-serif text-xl border-b border-dashed pb-2">আমাদের বিশেষত্ব</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-3 items-start">
                                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span className="text-sm text-foreground/80">১০০% সুতি কটন-বেক্সি/অরবিট এবং অরবিন্দ ফেব্রিক। গরমেও নামাজে দিবে প্রশান্তি। কালার গ্যারান্টি।</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Ruler className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span className="text-sm text-foreground/80">লং মাথা থেকে পা পর্যন্ত ফ্লোর টাচ ৭১-৭৩" ইঞ্চি। ঘের চওড়া ৮৬-৯০ ইঞ্চি (প্রায় ৫ গজ কাপড়ে তৈরি)।</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Scissors className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span className="text-sm text-foreground/80">ইলাস্টিক রাবার, লেইস ও ফিতা ব্যাবহার করা। সুবিধামতো ১০-১২" ছোট-বড় করা যাবে।</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Gift className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span className="text-sm text-foreground/80">সাথে একটি আকর্ষণীয় ওয়াটার প্রুফ জিপার ব্যাগ এবং হাত মোজা।</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                                <h4 className="font-semibold text-primary mb-2">অর্ডার করতে আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা দিন:</h4>
                                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 pl-2">
                                    <li>কোনো অগ্রিম পেমেন্ট প্রয়োজন নেই।</li>
                                    <li>প্রোডাক্ট হাতে পেয়ে দেখে পেমেন্ট করার সুবিধা।</li>
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Button asChild size="lg" className="rounded-full text-lg px-8 shadow-none hover:shadow-none transition-all">
                                    <Link href="/shop">
                                        এখনই অর্ডার করুন
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="rounded-full text-lg border-primary/20 hover:bg-primary/5">
                                    <Link href="/contact">
                                        যোগাযোগ করুন
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
