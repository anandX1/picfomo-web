import Link from "next/link";
import Image from "next/image";

export default function NewFooter() {
  return (
    <footer className="border-t border-white/5 py-16 bg-[#030305] text-white/60 text-xs">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            <Image src="/logo-full.png" alt="PicFomo Studio" width={160} height={40} className="object-contain" />
            <p className="text-white/50 leading-relaxed">
              Professional documentary captioning and multi-track NLE sequence generation for creators and editors.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Integrations</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="#features" className="hover:text-white transition-colors">Adobe Premiere Pro (.xml)</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Adobe After Effects (.jsx)</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">DaVinci Resolve (.srt)</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">OpenTimelineIO (.otio)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Pricing & Plans</h4>
            <ul className="flex flex-col gap-2">
              <li><Link href="#pricing" className="hover:text-white transition-colors">7-Day Launch Pass (₹49)</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pro Monthly (₹499)</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Founder Lifetime (₹2,999)</Link></li>
              <li><Link href="#download" className="hover:text-white transition-colors">Download Studio Setup</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Privacy & Trust</h4>
            <ul className="flex flex-col gap-2">
              <li><span className="text-white/40">100% Local On-Device Processing</span></li>
              <li><span className="text-white/40">Zero Cloud Audio/Video Storage</span></li>
              <li><span className="text-white/40">Full Commercial Rights to Exports</span></li>
              <li><span className="text-white/40">Support: support@picfomo.com</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40">
          <p>© 2026 PicFomo Technologies (picfomo.com). All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#pricing" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
