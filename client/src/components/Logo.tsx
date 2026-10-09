import { Link } from "react-router-dom";

type LogoVariant = "full" | "mark";
type LogoTone = "dark" | "light";

interface LogoProps {
    /** "full" renders the mark + wordmark, "mark" renders only the icon. */
    variant?: LogoVariant;
    /** "dark" for light backgrounds, "light" for dark/green backgrounds. */
    tone?: LogoTone;
    /** Total height of the mark in px. */
    size?: number;
    /** When provided, the logo becomes a home link. */
    to?: string;
    className?: string;
}

/**
 * GrocNest brand logo: a modern "nest" basket cradling a fresh leaf,
 * paired with a two-tone GrocNest wordmark.
 * Inline SVG only - no image assets or extra dependencies required.
 */
const Logo = ({
    variant = "full",
    tone = "dark",
    size = 28,
    to = "/",
    className = "",
}: LogoProps) => {
    const wordmark =
        tone === "light" ? "text-white" : "text-app-green";
    const wordmarkAccent =
        tone === "light" ? "text-emerald-300" : "text-brand-500";

    const mark = (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
        >
            <defs>
                <linearGradient
                    id="grocnest-mark-grad"
                    x1="8"
                    y1="6"
                    x2="40"
                    y2="44"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="55%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#1b3022" />
                </linearGradient>
            </defs>

            {/* Nest / basket body - rounded digital-style cradle */}
            <path
                d="M10 22h28a2 2 0 0 1 2 2.4c-.9 4.7-3.3 8.6-6.9 11.1A10 10 0 0 1 24 40a10 10 0 0 1-9.1-2.5c-3.6-2.5-6-6.4-6.9-11.1A2 2 0 0 1 10 22Z"
                fill="url(#grocnest-mark-grad)"
            />
            {/* Basket weave - subtle digital slots */}
            <path
                d="M14.5 27.5h19M16.8 33h14.4"
                stroke="#faf7f2"
                strokeOpacity="0.35"
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            {/* Fresh leaf sprouting from the nest */}
            <path
                d="M24 24c0-6.6 4.6-12.4 11.4-13.6 1 6.9-3.1 13.4-9.8 14.6"
                fill="#4ade80"
            />
            <path
                d="M24 24c-.7-4.8-4-8.8-8.7-10.4-1.1 5.3 1.9 10.6 7 12"
                fill="#16a34a"
            />
            {/* Leaf stem */}
            <path
                d="M24 25.5V17"
                stroke="#14532d"
                strokeWidth="2.2"
                strokeLinecap="round"
            />
        </svg>
    );

    const word = (
        <span
            className={`font-semibold tracking-tight leading-none ${wordmark}`}
        >
            Groc
            <span className={wordmarkAccent}>Nest</span>
        </span>
    );

    const content = (
        <span className="flex items-center gap-2 transition-transform duration-200 group-hover:-translate-y-0.5">
            {mark}
            {variant === "full" && word}
        </span>
    );

    if (!to) return <span className={`inline-flex ${className}`}>{content}</span>;

    return (
        <Link
            to={to}
            className={`group inline-flex ${className}`}
            aria-label="GrocNest home"
        >
            {content}
        </Link>
    );
};

export default Logo;
