import { useEffect, useState } from "react";

const services = [
  {
    category: "HAIR",
    name: "The fresh cut",
    description: "A shape that feels like you, only more you.",
    price: "₹1,200",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=900&q=85",
    alt: "A fresh, softly styled haircut",
  },
  {
    category: "HAIR",
    name: "Wash + blowout",
    description: "Main-character hair, no special occasion needed.",
    price: "₹1,500",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
    alt: "Beautifully styled hair at the salon",
  },
  {
    category: "SKIN",
    name: "The glow facial",
    description: "A deep-clean, big-glow reset for your skin.",
    price: "₹2,400",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
    alt: "A relaxing facial treatment",
  },
  {
    category: "BODY",
    name: "Unwind massage",
    description: "One hour to let your shoulders unclench.",
    price: "₹2,800",
    duration: "60 min",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85",
    alt: "A peaceful spa treatment room",
  },
  {
    category: "NAILS",
    name: "Mani, but make it you",
    description: "A tidy-up or a tiny work of art. Your call.",
    price: "₹900",
    duration: "45 min",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85",
    alt: "A fresh, detailed manicure",
  },
  {
    category: "BROWS",
    name: "Brow besties",
    description: "A little shape, a lot of face card.",
    price: "₹700",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=85",
    alt: "A close-up beauty portrait",
  },
];

const timeSlots = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
  "5:30 PM",
];
const categories = ["ALL", "HAIR", "SKIN", "BODY", "NAILS", "BROWS"];

function ArrowIcon({ diagonal = false }) {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
      <path
        d={diagonal ? "M5 15 15 5M6 5h9v9" : "M3 10h13m-5-5 5 5-5 5"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BookingDialog({ initialService, onClose }) {
  const [service, setService] = useState(initialService);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  function submitBooking(event) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const booking = {
      id: `${Date.now()}`,
      name: formData.get("name")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      service,
      date,
      time,
      createdAt: new Date().toISOString(),
    };

    if (
      !service ||
      !date ||
      !time ||
      !booking.name ||
      !booking.phone ||
      !booking.email
    ) {
      setError(
        "Please complete every field and choose a service, date, and time.",
      );
      return;
    }

    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("muse-bookings") || "[]",
      );
      if (!Array.isArray(savedBookings)) {
        throw new Error("Saved booking data is invalid.");
      }
      localStorage.setItem(
        "muse-bookings",
        JSON.stringify([...savedBookings, booking]),
      );
      setConfirmation(booking);
    } catch {
      setError(
        "We couldn’t save your request in this browser. Please try again.",
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="booking-title"
        aria-modal="true"
        className="relative my-auto w-full max-w-xl rounded-[2rem] bg-paper p-6 shadow-2xl sm:p-9"
        role="dialog"
      >
        <button
          aria-label="Close booking"
          className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white text-xl transition hover:bg-lime"
          onClick={onClose}
          type="button"
        >
          ×
        </button>

        {confirmation ? (
          <div className="py-8 text-center">
            <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-lime text-3xl">
              ✓
            </span>
            <p className="eyebrow">LOOKING GOOD ALREADY</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">
              Request saved!
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted">
              {confirmation.name}, your request for {confirmation.service} is in
              this browser for {confirmation.date} at {confirmation.time}. This
              demo doesn’t notify the salon, so please contact them directly to
              confirm.
            </p>
            <button
              className="button-dark mt-7"
              onClick={onClose}
              type="button"
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">YOUR SELF-CARE ERA STARTS HERE</p>
            <h2
              className="mt-3 pr-10 font-display text-4xl tracking-tight"
              id="booking-title"
            >
              Let’s get you in.
            </h2>
            <p className="mt-2 text-sm text-muted">
              Pick a service, a day, and your main-character time.
            </p>
            <form className="mt-7 space-y-5" onSubmit={submitBooking}>
              <label className="field-label">
                Service
                <select
                  className="field-input"
                  onChange={(event) => setService(event.target.value)}
                  required
                  value={service}
                >
                  <option value="">Choose your treatment</option>
                  {services.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name} · {item.price} · {item.duration}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="field-label">
                  Your name
                  <input
                    autoComplete="name"
                    className="field-input"
                    name="name"
                    placeholder="Jamie Smith"
                    required
                  />
                </label>
                <label className="field-label">
                  Phone number
                  <input
                    autoComplete="tel"
                    className="field-input"
                    name="phone"
                    placeholder="+91 98765 43210"
                    required
                    type="tel"
                  />
                </label>
              </div>
              <label className="field-label">
                Email
                <input
                  autoComplete="email"
                  className="field-input"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </label>
              <label className="field-label">
                Choose a date
                <input
                  className="field-input"
                  min={minDate}
                  onChange={(event) => setDate(event.target.value)}
                  required
                  type="date"
                  value={date}
                />
              </label>
              <fieldset>
                <legend className="field-label">Pick a time</legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      aria-pressed={time === slot}
                      className={`rounded-full border px-3 py-2.5 text-xs font-semibold transition ${time === slot ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
                      key={slot}
                      onClick={() => setTime(slot)}
                      type="button"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </fieldset>
              {error && (
                <p className="text-sm font-medium text-red-700" role="alert">
                  {error}
                </p>
              )}
              <button
                className="button-dark w-full justify-center"
                type="submit"
              >
                Save my appointment request <ArrowIcon />
              </button>
              <p className="text-center text-xs leading-5 text-muted">
                Demo booking only: your request is saved on this device and does
                not reach the salon.
              </p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const filteredServices =
    activeCategory === "ALL"
      ? services
      : services.filter((service) => service.category === activeCategory);

  function openBooking(service = "") {
    setSelectedService(service);
    setBookingOpen(true);
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-paper text-ink">
      <div className="bg-ink px-4 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white sm:text-xs">
        A little treat, a lot of you. New guests get 15% off their first visit.
      </div>

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <a
          aria-label="Muse Beauty Club home"
          className="font-display text-3xl font-semibold tracking-[-0.08em]"
          href="#home"
        >
          muse<span className="text-coral">.</span>
          <span className="ml-2 align-middle font-sans text-[9px] font-bold uppercase tracking-[0.22em]">
            beauty club
          </span>
        </a>
        <nav
          className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-5 border-b border-line bg-paper px-6 py-6 text-sm font-medium md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0`}
        >
          <a
            className="transition hover:text-coral"
            href="#services"
            onClick={() => setMenuOpen(false)}
          >
            The menu
          </a>
          <a
            className="transition hover:text-coral"
            href="#about"
            onClick={() => setMenuOpen(false)}
          >
            Our vibe
          </a>
          <a
            className="transition hover:text-coral"
            href="#reviews"
            onClick={() => setMenuOpen(false)}
          >
            Love notes
          </a>
          <a
            className="transition hover:text-coral"
            href="#visit"
            onClick={() => setMenuOpen(false)}
          >
            Find us
          </a>
          <button
            className="button-dark md:hidden"
            onClick={() => openBooking()}
            type="button"
          >
            Book a visit <ArrowIcon />
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <button
            className="button-dark hidden sm:flex"
            onClick={() => openBooking()}
            type="button"
          >
            Book a visit <ArrowIcon />
          </button>
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-xl md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </header>

      <main>
        <section
          className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-7 sm:px-8 md:grid-cols-[1fr_0.88fr] md:items-center md:gap-8 md:pb-24 md:pt-12"
          id="home"
        >
          <div className="relative z-10">
            <p className="eyebrow">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-coral" />{" "}
              GOOD HAIR. GOOD SKIN. GOOD ENERGY.
            </p>
            <h1 className="mt-6 max-w-2xl font-display text-[clamp(4rem,10vw,8.5rem)] leading-[0.85] tracking-[-0.08em]">
              You, but{" "}
              <span className="font-editorial italic text-coral">glowing.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Your neighborhood spot for feeling like your favorite version of
              you. Come as you are, leave with the good hair flip.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                className="button-dark"
                onClick={() => openBooking()}
                type="button"
              >
                Book your moment <ArrowIcon />
              </button>
              <a
                className="inline-flex items-center gap-2 text-sm font-semibold underline decoration-line underline-offset-4 transition hover:decoration-ink"
                href="#services"
              >
                Browse the menu <ArrowIcon />
              </a>
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "photo-1534528741775-53994a69daeb",
                  "photo-1500648767791-00dcc994a43e",
                  "photo-1531123897727-8f129e1688ce",
                ].map((image) => (
                  <img
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-paper object-cover"
                    key={image}
                    src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=100&q=80`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted">
                <span className="font-bold text-ink">4.9/5</span> from people
                who get it <span className="text-amber-500">★★★★★</span>
              </p>
            </div>
            <span className="absolute -left-6 top-40 -z-10 hidden font-editorial text-[16rem] leading-none text-[#f2e8dc] md:block">
              ✳
            </span>
          </div>

          <div className="relative mx-auto w-full max-w-lg md:ml-auto">
            <div className="absolute -right-4 -top-4 z-10 grid h-24 w-24 rotate-12 place-items-center rounded-full bg-lime text-center text-[10px] font-bold uppercase leading-4 tracking-wider sm:-right-5 sm:-top-5 sm:h-28 sm:w-28">
              YOUR
              <br />
              SELF-CARE
              <br />
              ERA ✳
            </div>
            <div className="relative h-[390px] overflow-hidden rounded-[48%_48%_1.5rem_1.5rem] bg-[#e7d5c7] sm:h-[500px]">
              <img
                alt="A guest enjoying a calm moment at the salon"
                className="h-full w-full object-cover object-center"
                src="https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1200&q=90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    No rush. No rules.
                  </p>
                  <p className="mt-1 font-editorial text-3xl italic">
                    Just really good care.
                  </p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/70">
                  <ArrowIcon diagonal />
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl bg-white p-4 shadow-lg sm:block">
              <p className="text-xs text-muted">Your next appointment?</p>
              <p className="mt-1 font-semibold">
                A very good idea <span className="text-coral">♥</span>
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-white/60">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-7 text-center sm:grid-cols-4 sm:px-8">
            {[
              ["01", "Good people, always"],
              ["02", "No-pressure beauty"],
              ["03", "Your vibe comes first"],
              ["04", "A little extra care"],
            ].map(([number, copy]) => (
              <div
                className="flex items-center justify-center gap-3"
                key={number}
              >
                <span className="font-editorial text-2xl italic text-coral">
                  {number}
                </span>
                <span className="text-left text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                  {copy}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
          id="services"
        >
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">THE GOOD STUFF</p>
              <h2 className="mt-3 font-display text-5xl tracking-[-0.06em] sm:text-6xl">
                A little{" "}
                <span className="font-editorial italic text-coral">
                  menu magic.
                </span>
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-muted">
                The feel-good essentials, done with intention. Pick your thing;
                we’ll take it from here.
              </p>
            </div>
            <a
              className="inline-flex items-center gap-2 self-start text-sm font-semibold underline decoration-line underline-offset-4 sm:self-auto"
              href="#visit"
            >
              Need a recommendation? <ArrowIcon />
            </a>
          </div>

          <div
            aria-label="Filter services by category"
            className="mt-8 flex gap-2 overflow-x-auto pb-2"
            role="group"
          >
            {categories.map((category) => (
              <button
                aria-pressed={activeCategory === category}
                className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-[10px] font-bold tracking-[0.16em] transition ${activeCategory === category ? "border-ink bg-ink text-white" : "border-line bg-transparent hover:border-ink"}`}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service, index) => (
              <article
                className="group overflow-hidden rounded-[1.5rem] border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                key={service.name}
              >
                <div className="relative h-56 overflow-hidden bg-[#eadfd5]">
                  <img
                    alt={service.alt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    src={service.image}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1.5 text-[9px] font-bold tracking-[0.18em]">
                    {service.category}
                  </span>
                  {index === 0 && activeCategory === "ALL" && (
                    <span className="absolute right-4 top-4 rounded-full bg-lime px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest">
                      A fave
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-2xl tracking-tight">
                      {service.name}
                    </h3>
                    <span className="whitespace-nowrap pt-1 text-sm font-bold">
                      {service.price}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {service.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-xs text-muted">
                      {service.duration}
                    </span>
                    <button
                      className="inline-flex items-center gap-2 text-xs font-bold transition hover:text-coral"
                      onClick={() => openBooking(service.name)}
                      type="button"
                    >
                      Book this <ArrowIcon />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-lime px-5 py-16 sm:px-8 sm:py-20" id="about">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                alt="A stylist adding the finishing touches to a guest's hair"
                className="h-[340px] w-full object-cover sm:h-[420px]"
                loading="lazy"
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-paper px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                A little more you, every time
              </span>
            </div>
            <div className="md:pl-10">
              <p className="eyebrow">A SPACE TO EXHALE</p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.06em] sm:text-6xl">
                Beauty rules?
                <br />
                <span className="font-editorial italic">
                  We don’t know her.
                </span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-ink/70 sm:text-base">
                We’re here for the big change, the maintenance trim, and the “I
                just need an hour to myself” appointment. No judgement, no
                one-size-fits-all. Just thoughtful people, good playlists, and
                care that meets you where you are.
              </p>
              <button
                className="button-dark mt-7"
                onClick={() => openBooking()}
                type="button"
              >
                Come say hi <ArrowIcon />
              </button>
              <div className="mt-9 flex gap-8 border-t border-ink/15 pt-6">
                <div>
                  <p className="font-display text-3xl">
                    4.9<span className="text-coral">★</span>
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest">
                    Community rating
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl">
                    100<span className="text-coral">%</span>
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest">
                    Come as you are
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
          id="reviews"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">DON’T JUST TAKE OUR WORD FOR IT</p>
            <p className="mt-5 font-editorial text-4xl leading-tight sm:text-5xl">
              “I came in needing a trim and left feeling like I had my{" "}
              <span className="italic text-coral">life together.</span> 10/10,
              no notes.”
            </p>
            <div className="mt-6 text-xs font-bold uppercase tracking-widest">
              — Alex, very happy regular{" "}
              <span className="ml-2 text-amber-500">★★★★★</span>
            </div>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {[
              [
                "“The vibes are immaculate and my hair has never looked better.”",
                "Jules · Hair",
              ],
              [
                "“Finally, a facial that didn’t feel like a sales pitch. Just lovely.”",
                "Sam · Skin",
              ],
              [
                "“Booked a massage on a whim. My shoulders say thank you.”",
                "Riya · Body",
              ],
            ].map(([quote, author]) => (
              <blockquote
                className="rounded-2xl border border-line bg-white p-6"
                key={author}
              >
                <p className="text-amber-500">★★★★★</p>
                <p className="mt-4 font-editorial text-2xl leading-snug">
                  {quote}
                </p>
                <footer className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted">
                  {author}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section
          className="bg-ink px-5 py-16 text-white sm:px-8 sm:py-20"
          id="visit"
        >
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-lime">
                YOUR NEXT FAVORITE PLACE
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-5xl tracking-[-0.06em] sm:text-7xl">
                Your chair is{" "}
                <span className="font-editorial italic text-lime">
                  waiting.
                </span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
                Questions, big ideas, or just want to say hey? We’d love to meet
                you.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:min-w-64">
              <button
                className="button-lime"
                onClick={() => openBooking()}
                type="button"
              >
                Make a booking <ArrowIcon />
              </button>
              <a
                className="text-sm text-white/75 underline underline-offset-4 hover:text-lime"
                href="mailto:hello@musebeautyclub.example"
              >
                hello@musebeautyclub.example
              </a>
              <p className="text-xs leading-5 text-white/50">
                Mon–Sat · 10 AM–7 PM
                <br />
                Location details shared when you book
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <a
          aria-label="Muse Beauty Club home"
          className="font-display text-xl font-semibold tracking-[-0.08em] text-ink"
          href="#home"
        >
          muse<span className="text-coral">.</span>
        </a>
        <p>
          Good hair days, good skin days, good every-days. ©{" "}
          {new Date().getFullYear()} Muse Beauty Club
        </p>
        <a className="font-semibold text-ink hover:text-coral" href="#home">
          Back to top ↑
        </a>
      </footer>

      {bookingOpen && (
        <BookingDialog
          initialService={selectedService}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
