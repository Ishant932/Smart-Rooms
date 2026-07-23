import { MapPin, Sparkles, Gamepad2, Shield, Gift, Phone, MessageCircle } from 'lucide-react';



const TICKER_ITEMS = [

  { icon: MapPin, text: 'Rooms in Malviya Nagar · Mansarovar · Vaishali Nagar · Sodala · Jagatpura · Gopalpura · Khatipura · Vidhyadhar Nagar' },

  { icon: Sparkles, text: 'SmartRoooms — Jaipur\'s trusted zero-brokerage platform for students & working professionals' },

  { icon: Shield, text: '100% owner-posted listings · Admin-verified photos · Chat with owners before you visit' },

  { icon: Gamepad2, text: 'Play 11 mini games & earn points — redeem 500 pts for ₹50 rent credit' },

  { icon: Sparkles, text: 'Smart Services — book tiffin, plumber, electrician, laundry & 12+ home services in Jaipur' },

  { icon: Gift, text: 'Welcome bonus on signup · Refer friends & earn cash rewards' },

  { icon: MessageCircle, text: 'In-app owner chat · SmartRoooms helpline · Previous tenant WhatsApp connect' },

  { icon: MapPin, text: 'Near MNIT · JECRC · Amity · Poornima · Manipal · IIS University campuses' },

  { icon: Sparkles, text: 'Boys PG · Girls PG · Hostels · Flats · Shared rooms — all in Jaipur only' },

];



export default function InfoTicker() {

  const row = [...TICKER_ITEMS, ...TICKER_ITEMS];



  return (

    <div className="relative z-[60] border-b border-brand-300/30 bg-gradient-to-r from-brand-700 via-cyan-700 to-violet-800 py-2">

      <div className="marquee-mask">

        <div className="marquee-track marquee-left info-ticker flex items-center text-xs font-medium text-white sm:text-sm">

          {row.map((item, i) => (

            <span key={i} className="mx-6 flex shrink-0 items-center gap-2 whitespace-nowrap">

              <item.icon size={14} className="text-amber-300" />

              {item.text}

            </span>

          ))}

        </div>

      </div>

    </div>

  );

}

