import type { MDXComponents } from "mdx/types"
import Link from "next/link"

/**
 * MDX component overrides for United Tattoo
 * These components style MDX content to match the design system
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings - Using Playfair Display font
    h1: ({ children }) => (
      <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-semibold text-ink tracking-tight mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-ink tracking-tight mb-4 mt-12 leading-snug">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-playfair text-2xl md:text-3xl font-semibold text-ink tracking-tight mb-3 mt-8 leading-snug">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-grotesk text-xl font-semibold text-ink tracking-tight mb-2 mt-6">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="font-grotesk text-lg font-semibold text-ink tracking-tight mb-2 mt-4">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="font-grotesk text-base font-semibold text-ink tracking-tight mb-2 mt-4">
        {children}
      </h6>
    ),

    // Paragraph - Using Space Grotesk font
    p: ({ children }) => (
      <p className="font-grotesk text-base md:text-lg text-charcoal/80 leading-relaxed mb-4">
        {children}
      </p>
    ),

    // Links - Burnt orange color scheme
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http")
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-burnt hover:text-terracotta underline underline-offset-4 transition-colors duration-200"
          >
            {children}
          </a>
        )
      }
      return (
        <Link
          href={href || "#"}
          className="text-burnt hover:text-terracotta underline underline-offset-4 transition-colors duration-200"
        >
          {children}
        </Link>
      )
    },

    // Lists
    ul: ({ children }) => (
      <ul className="font-grotesk text-charcoal/80 list-disc list-outside pl-6 mb-4 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="font-grotesk text-charcoal/80 list-decimal list-outside pl-6 mb-4 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">
        {children}
      </li>
    ),

    // Blockquote - Styled with left border
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-burnt pl-6 py-2 my-6 italic text-charcoal/70 font-playfair text-lg">
        {children}
      </blockquote>
    ),

    // Code blocks
    code: ({ children }) => (
      <code className="bg-sand/50 text-burnt px-1.5 py-0.5 rounded font-mono text-sm">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-charcoal text-cream p-4 rounded-xl overflow-x-auto mb-4 text-sm">
        {children}
      </pre>
    ),

    // Horizontal rule
    hr: () => (
      <hr className="border-t border-sage/30 my-8" />
    ),

    // Strong and emphasis
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-charcoal">
        {children}
      </em>
    ),

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse font-grotesk text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-sand/50 border-b border-sage/30">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-sage/20">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-sand/30 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="text-left px-4 py-3 font-semibold text-ink">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-charcoal/80">
        {children}
      </td>
    ),

    // Images - Basic styling (can't use next/image in MDX easily)
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || ""}
        className="rounded-2xl shadow-md my-6 max-w-full h-auto"
        loading="lazy"
      />
    ),

    // Allow custom components to be passed through
    ...components,
  }
}

