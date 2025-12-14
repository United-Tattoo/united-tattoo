I need a homepage design for United Tattoo, a tattoo studio in Fountain Colorado built on family values, community and inclusivity.

Here is the existing color palette of the brand:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-18T00:00:00Z",
  "designLanguage": {
    "name": "United Tattoo Design System",
    "description": "A living design system for United Tattoo that blends sun-washed plaster aesthetics with gallery pacing principles. The system prioritizes tactile interactions, sensory analogies, and deliberate movement patterns.",
    "philosophy": "Sun-washed plaster aesthetic with gallery pacing, tactile interactions, sensory analogies, and deliberate brush-stroke-like movements.",
    "principles": [
      "Sensory-driven design inspired by plaster walls catching afternoon light",
      "Gallery pacing: spacious, staggered, editorial rhythm",
      "Typography as carved etchings: precise, deliberate, never shouting",
      "Micro-interactions that feel tactile and intentional",
      "Fade/slide reveals with 200-300ms ease-out timing",
      "Authentic, transparent process-focused messaging"
    ]
  },
  "colors": {
    "palette": {
      "primary": {
        "burntOrange": {
          "name": "Burnt Orange",
          "hex": "#E67E50",
          "rgb": "rgb(230, 126, 80)",
          "cssVar": "N/A",
          "usage": "Hero gradients, CTA fills, warm spotlight moments, primary button fills",
          "accessibility": "Used on dark text (charcoal/ink) backgrounds for sufficient contrast"
        },
        "terracotta": {
          "name": "Terracotta",
          "hex": "#D87850",
          "rgb": "rgb(216, 120, 80)",
          "cssVar": "--terracotta",
          "usage": "Secondary buttons, form focus states, micro interactions, calendar booked states",
          "accessibility": "Primary action color with high contrast against white backgrounds"
        },
        "burnt": {
          "name": "Burnt (Dark Orange)",
          "hex": "#b0471e",
          "rgb": "rgb(176, 71, 30)",
          "cssVar": "--burnt",
          "usage": "Primary button background, link underlines, strong accent moments",
          "accessibility": "Darkest orange variant for maximum contrast"
        }
      },
      "secondary": {
        "sageConcrete": {
          "name": "Sage Concrete",
          "hex": "#7A8B8B",
          "rgb": "rgb(122, 139, 139)",
          "cssVar": "N/A",
          "usage": "Page background gradients, cards, filmstrip fades, subtle overlays",
          "accessibility": "Background color providing calm, muted tone"
        },
        "sage": {
          "name": "Sage",
          "hex": "#a28f79",
          "rgb": "rgb(162, 143, 121)",
          "cssVar": "--sage",
          "usage": "Success toast backgrounds, accent elements, metadata text",
          "accessibility": "Desaturated green for calming success states"
        },
        "deepOlive": {
          "name": "Deep Olive",
          "hex": "#4a4034",
          "rgb": "rgb(74, 64, 52)",
          "cssVar": "--deep-olive",
          "usage": "Dark accent color, alternative text color",
          "accessibility": "High contrast dark tone"
        },
        "moss": {
          "name": "Moss",
          "hex": "#6f5c49",
          "rgb": "rgb(111, 92, 73)",
          "cssVar": "--moss",
          "usage": "Section labels, metadata text, card titles, eyebrow text",
          "accessibility": "Medium-dark brown for labels and metadata"
        }
      },
      "neutral": {
        "charcoal": {
          "name": "Charcoal",
          "hex": "#1c1915",
          "rgb": "rgb(28, 25, 21)",
          "cssVar": "--charcoal",
          "usage": "Darkest text color, photography overlays, line work",
          "accessibility": "Maximum contrast text color"
        },
        "ink": {
          "name": "Ink",
          "hex": "#241b16",
          "rgb": "rgb(36, 27, 22)",
          "cssVar": "--ink",
          "usage": "Primary text color, headings, body copy",
          "accessibility": "Primary text color with full contrast"
        },
        "cream": {
          "name": "Cream",
          "hex": "#fff7ec",
          "rgb": "rgb(255, 247, 236)",
          "cssVar": "--cream",
          "usage": "Light background, card fills, soft off-white",
          "accessibility": "Warm white background alternative"
        },
        "sand": {
          "name": "Sand",
          "hex": "#f2e3d0",
          "rgb": "rgb(242, 227, 208)",
          "cssVar": "--sand",
          "usage": "Ghost button backgrounds, light card fills, hero overlay base",
          "accessibility": "Warm beige for soft backgrounds"
        },
        "white": {
          "name": "White",
          "hex": "#ffffff",
          "rgb": "rgb(255, 255, 255)",
          "usage": "Button text, form inputs, toast icons background",
          "accessibility": "Maximum brightness for text on colored backgrounds"
        }
      },
      "semantic": {
        "success": {
          "name": "Success",
          "hex": "#a28f79",
          "cssVar": "--sage",
          "usage": "Success toasts, confirmation states, check marks",
          "description": "Sage green for positive actions"
        },
        "alert": {
          "name": "Alert",
          "hex": "#e59863",
          "cssVar": "--rose",
          "usage": "Alert toasts, warning states, notification badges",
          "description": "Rose/coral for attention-grabbing notifications"
        },
        "rose": {
          "name": "Rose",
          "hex": "#e59863",
          "rgb": "rgb(229, 152, 99)",
          "cssVar": "--rose",
          "usage": "Alert accent, warm highlights, notification colors",
          "accessibility": "Warm accent color for alerts and highlights"
        }
      },
      "opacity": {
        "10": 0.1,
        "15": 0.15,
        "18": 0.18,
        "20": 0.2,
        "25": 0.25,
        "3": 0.03,
        "35": 0.35,
        "4": 0.04,
        "5": 0.05,
        "50": 0.5,
        "55": 0.55,
        "6": 0.06,
        "65": 0.65,
        "75": 0.75,
        "8": 0.08,
        "85": 0.85,
        "88": 0.88,
        "9": 0.09,
        "90": 0.9,
        "95": 0.95,
        "98": 0.98"
      },
      "gradients": {
        "heroBackground": {
          "value": "linear-gradient(180deg, #7A8B8B 0%, #9CAAA6 45%, #F2E3D0 100%)",
          "usage": "Full-page background gradient"
        },
        "heroOverlay": {
          "value": "linear-gradient(135deg, rgba(242, 227, 208, 0.95), rgba(255, 247, 236, 0.9))",
          "usage": "Hero section card background"
        },
        "buttonGradient": {
          "value": "linear-gradient(90deg, #b0471e, #d26a32)",
          "usage": "Primary button gradient (not currently implemented)"
        },
        "burnedToRose": {
          "value": "linear-gradient(90deg, #b0471e, #e59863)",
          "usage": "Filmstrip progress bar"
        }
      }
    }
  },
  "typography": {
    "fontFamilies": {
      "primary": {
        "name": "Playfair Display",
        "fallback": "Times New Roman, serif",
        "usage": "Display, headlines, statements",
        "source": "Google Fonts",
        "weights": [400, 600]
      },
      "secondary": {
        "name": "Space Grotesk",
        "fallback": "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        "usage": "Body, interface, metadata",
        "source": "Google Fonts",
        "weights": [400, 500, 600]
      }
    },
    "sizes": {
      "xs": {
        "value": "0.7rem",
        "usage": "Uppercase metadata, filmstrip labels"
      },
      "sm": {
        "value": "0.75rem",
        "usage": "Small labels, form hints, section labels"
      },
      "base": {
        "value": "0.95rem",
        "usage": "Body copy, interface text"
      },
      "md": {
        "value": "1rem",
        "usage": "Regular body text"
      },
      "lg": {
        "value": "1.1rem",
        "usage": "Large body, section leads"
      },
      "xl": {
        "value": "1.2rem",
        "usage": "Card titles, strong statements"
      },
      "2xl": {
        "value": "1.9rem",
        "usage": "Section headings (responsive)"
      },
      "3xl": {
        "value": "2.4rem",
        "usage": "Main interface headings"
      },
      "4xl": {
        "value": "2.5rem",
        "usage": "Page section headings"
      },
      "5xl": {
        "value": "3rem",
        "usage": "Large section headings"
      },
      "6xl": {
        "value": "3.8rem",
        "usage": "Hero title, main page heading"
      }
    },
    "weights": {
      "light": 300,
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeights": {
      "tight": 1.1,
      "snug": 1.15,
      "normal": 1.5,
      "relaxed": 1.6,
      "loose": 1.65,
      "veryLoose": 1.7
    },
    "letterSpacing": {
      "tight": "-0.02em",
      "normal": "0em",
      "wide": "0.05em",
      "wider": "0.2em",
      "widest": "0.25em",
      "veryWide": "0.3em",
      "extraWide": "0.35em"
    },
    "textTransforms": {
      "uppercase": "text-transform: uppercase",
      "capitalize": "text-transform: capitalize",
      "none": "text-transform: none"
    },
    "typographyRules": {
      "eyebrow": {
        "size": "0.75rem",
        "weight": 600,
        "transform": "uppercase",
        "letterSpacing": "0.3em",
        "color": "var(--moss)",
        "usage": "Section labels, metadata headers"
      },
      "sectionLabel": {
        "size": "0.85rem",
        "weight": 600,
        "transform": "uppercase",
        "letterSpacing": "0.3em",
        "color": "var(--moss)",
        "usage": "Section dividers, component labels"
      },
      "display": {
        "family": "Playfair Display",
        "size": "clamp(2.5rem, 5vw, 3.8rem)",
        "weight": 400,
        "lineHeight": 1.1,
        "usage": "Hero title"
      },
      "heading2": {
        "family": "Playfair Display",
        "size": "clamp(1.9rem, 4vw, 3rem)",
        "weight": 400,
        "lineHeight": 1.1,
        "usage": "Section headings"
      },
      "heading3": {
        "size": "0.95rem",
        "weight": 600,
        "transform": "uppercase",
        "letterSpacing": "0.2em",
        "usage": "Card titles, data card headers"
      },
      "heading4": {
        "size": "0.85rem",
        "weight": 600,
        "letterSpacing": "0.2em",
        "usage": "Component labels, subsection headers"
      },
      "body": {
        "family": "Space Grotesk",
        "size": "0.95rem",
        "weight": 400,
        "lineHeight": 1.6,
        "usage": "Body copy, interface text"
      },
      "lead": {
        "size": "clamp(0.95rem, 2vw, 1.3rem)",
        "color": "rgba(31, 27, 23, 0.75)",
        "lineHeight": 1.65,
        "maxWidth": "54ch",
        "usage": "Introductory paragraph text, section descriptions"
      },
      "accent": {
        "size": "0.9rem",
        "weight": 500,
        "letterSpacing": "0.25em",
        "transform": "uppercase",
        "usage": "Buttons, accent text, metadata"
      }
    }
  },
  "spacing": {
    "baseUnit": "0.5rem",
    "scale": {
      "0": "0",
      "xs": "0.4rem",
      "sm": "0.5rem",
      "md": "0.8rem",
      "lg": "1rem",
      "xl": "1.2rem",
      "2xl": "1.5rem",
      "3xl": "1.8rem",
      "4xl": "2rem",
      "5xl": "2.5rem",
      "6xl": "3rem",
      "7xl": "3.5rem",
      "8xl": "4rem",
      "9xl": "5rem",
      "10xl": "6rem"
    },
    "padding": {
      "container": "clamp(1.5rem, 4vw, 5rem)",
      "containerLarge": "clamp(2rem, 5vw, 6rem)",
      "card": "1.6rem",
      "cardDense": "1.4rem",
      "cardLarge": "2rem",
      "button": "1rem 1.6rem",
      "section": "clamp(2.5rem, 6vw, 5rem)"
    },
    "margin": {
      "section": "3.5rem",
      "sectionLarge": "4rem"
    },
    "gap": {
      "xs": "0.4rem",
      "sm": "0.8rem",
      "md": "1rem",
      "lg": "1.2rem",
      "xl": "1.5rem",
      "2xl": "1.8rem",
      "3xl": "2rem",
      "4xl": "2.5rem",
      "5xl": "3rem",
      "6xl": "4rem"
    },
    "gridGaps": {
      "tight": "1rem",
      "normal": "1.8rem",
      "comfortable": "2rem",
      "spacious": "clamp(2rem, 5vw, 5rem)"
    }
  },
  "layout": {
    "maxWidth": "1600px",
    "breakpoints": {
      "mobile": "720px",
      "tablet": "1024px",
      "desktop": "1600px"
    },
    "responsivePatterns": {
      "containerPadding": "clamp(1.5rem, 4vw, 5rem)",
      "sectionPadding": "clamp(2rem, 5vw, 6rem)",
      "gapResponsive": "clamp(1.5rem, 4vw, 4rem)"
    },
    "gridSystems": {
      "gridTwo": {
        "description": "Two-column auto-fit grid for cards",
        "css": "grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))",
        "gap": "1.8rem",
        "usage": "Color swatches, data cards, component grids"
      },
      "stickySplit": {
        "description": "Sticky left column with flexible right column",
        "css": "grid-template-columns: minmax(260px, 0.85fr) minmax(320px, 1fr)",
        "gap": "clamp(1.5rem, 4vw, 4rem)",
        "usage": "Identity section, process storytelling"
      },
      "layoutExamples": {
        "description": "Three-column layout for gallery-style displays",
        "css": "grid-template-columns: repeat(3, 1fr)",
        "gap": "clamp(2rem, 4vw, 4rem)",
        "responsiveBreakpoint": "720px = 1fr"
      },
      "componentDemo": {
        "description": "Auto-fit grid for component showcases",
        "css": "grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))",
        "gap": "2rem"
      },
      "interactionSplit": {
        "description": "Split layout for interaction principles and examples",
        "css": "grid-template-columns: minmax(300px, 0.85fr) minmax(400px, 1fr)",
        "gap": "clamp(2rem, 5vw, 4rem)"
      },
      "stickyGrid": {
        "description": "Sticky left panel with scrolling right content",
        "css": "grid-template-columns: minmax(230px, 320px) minmax(280px, 1fr)",
        "gap": "2rem"
      },
      "swapContentTrack": {
        "description": "Two-column layout for interface swap sections",
        "css": "grid-template-columns: minmax(400px, 1fr) minmax(380px, 0.95fr)",
        "gap": "clamp(3rem, 5vw, 6rem)"
      }
    },
    "fullBleedPatterns": {
      "fullBleed": {
        "width": "100vw",
        "marginLeft": "calc(50% - 50vw)",
        "marginRight": "calc(50% - 50vw)",
        "usage": "Hero, filmstrip, section dividers"
      }
    },
    "stickyPositioning": {
      "columnSticky": {
        "position": "sticky",
        "top": "5rem",
        "alignSelf": "start",
        "usage": "Sidebar in sticky-split layouts"
      },
      "panelSticky": {
        "position": "sticky",
        "top": "2rem",
        "usage": "Sticky panels in scroll-based sections"
      }
    },
    "mobileResponsive": {
      "breakpoint": "720px",
      "changes": {
        "stickySplit": "1fr (stacks vertically)",
        "layoutExamples": "1fr (single column)",
        "stickyColumn": "position: static",
        "interactionSplit": "1fr (stacks vertically)",
        "containerPadding": "1.5rem",
        "heroHeight": "50vh"
      }
    }
  },
  "designStyle": {
    "borderRadius": {
      "xs": "8px",
      "sm": "12px",
      "md": "14px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "22px",
      "3xl": "24px",
      "4xl": "28px",
      "5xl": "32px",
      "full": "999px"
    },
    "borderRadiusUsage": {
      "buttons": "12px",
      "formInputs": "12px",
      "cards": "18px-24px",
      "largeCards": "22px-28px",
      "filmstripItems": "32px",
      "chips": "999px"
    },
    "shadows": {
      "none": "none",
      "sm": "0 4px 12px rgba(31, 27, 23, 0.08)",
      "md": "0 12px 28px rgba(31, 27, 23, 0.1)",
      "lg": "0 14px 24px rgba(31, 27, 23, 0.18)",
      "xl": "0 20px 35px rgba(31, 27, 23, 0.1)",
      "2xl": "0 20px 40px rgba(31, 27, 23, 0.2)",
      "3xl": "0 25px 40px rgba(31, 27, 23, 0.08)",
      "4xl": "0 32px 60px rgba(31, 27, 23, 0.2)",
      "5xl": "0 35px 55px rgba(31, 27, 23, 0.18)",
      "6xl": "0 40px 70px rgba(31, 27, 23, 0.25)",
      "filmic": "0 40px 70px rgba(31, 27, 23, 0.25)"
    },
    "borders": {
      "width": {
        "hairline": "1px",
        "thin": "1px",
        "thick": "4px"
      },
      "style": "solid",
      "colors": {
        "subtle": "rgba(122, 139, 139, 0.2)",
        "muted": "rgba(210, 106, 50, 0.2)",
        "light": "rgba(31, 27, 23, 0.08)",
        "lighter": "rgba(31, 27, 23, 0.12)",
        "dashed": "1px dashed rgba(122, 139, 139, 0.3)"
      }
    },
    "backdropFilters": {
      "heroOverlay": "blur(12px) saturate(110%)",
      "usage": "Hero section card background blurring"
    },
    "maskImages": {
      "heroFade": "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
      "usage": "Hero section fade to transparent at bottom"
    },
    "blendModes": {
      "multiply": "mix-blend-mode: multiply",
      "usage": "Texture overlay on body background"
    }
  },
  "animations": {
    "timing": {
      "fast": "0.2s",
      "normal": "0.3s",
      "slow": "0.6s",
      "slower": "0.8s"
    },
    "easing": {
      "easeOut": "ease-out",
      "easeIn": "ease-in",
      "linear": "linear"
    },
    "scrollAnimations": {
      "reveal": {
        "initial": {
          "opacity": 0,
          "transform": "translateY(60px)"
        },
        "active": {
          "opacity": 1,
          "transform": "translateY(0)"
        },
        "timing": "0.8s ease-out",
        "trigger": "Intersection Observer (threshold: 0.18)",
        "usage": "Fade-in and slide-up animations on scroll"
      },
      "typeCard": {
        "initial": {
          "opacity": 0,
          "transform": "perspective(900px) rotateX(10deg) translateY(60px)"
        },
        "active": {
          "opacity": 1,
          "transform": "perspective(900px) rotateX(0deg) translateY(0)"
        },
        "timing": "0.8s ease",
        "usage": "3D rotation effect for typography cards"
      },
      "sectionDivider": {
        "initial": {
          "opacity": 0,
          "transform": "scaleX(0)"
        },
        "active": {
          "opacity": 1,
          "transform": "scaleX(1)"
        },
        "timing": "opacity 0.6s ease-out, transform 0.8s ease-out",
        "usage": "Section separator line animation"
      },
      "sectionTransition": {
        "initial": {
          "opacity": 0,
          "transform": "translateY(80px)"
        },
        "active": {
          "opacity": 1,
          "transform": "translateY(0)"
        },
        "timing": "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
        "usage": "Delayed section entrance animations"
      }
    },
    "componentAnimations": {
      "button": {
        "hover": {
          "transform": "translateY(-1px)",
          "boxShadow": "0 8px 16px rgba(186, 75, 47, 0.2)"
        },
        "timing": "0.2s ease",
        "motionExample": "Buttons scale to 105% with shadow bloom on hover"
      },
      "buttonScale": {
        "hover": {
          "transform": "scale(1.05) translateY(-1px)",
          "boxShadow": "0 12px 24px rgba(186, 75, 47, 0.3)"
        },
        "timing": "0.2s ease",
        "usage": "Enhanced button hover in motion examples"
      },
      "linkUnderline": {
        "initial": {
          "width": 0,
          "position": "absolute",
          "bottom": "-2px",
          "left": 0,
          "height": "2px",
          "background": "var(--burnt)"
        },
        "hover": {
          "width": "100%"
        },
        "timing": "0.3s ease-out",
        "usage": "Link underlines draw from left to right like painted stroke"
      },
      "layoutExample": {
        "hover": {
          "transform": "translateY(-6px)",
          "boxShadow": "0 32px 60px rgba(31, 27, 23, 0.2)"
        },
        "imageHover": {
          "transform": "scale(1.03)"
        },
        "timing": "0.3s ease"
      },
      "motionExampleCard": {
        "hover": {
          "transform": "translateY(-2px)",
          "boxShadow": "0 16px 36px rgba(31, 27, 23, 0.15)"
        },
        "timing": "0.3s ease"
      },
      "swatch": {
        "hover": {
          "transform": "scale(1.1)"
        },
        "timing": "0.2s ease",
        "usage": "Color swatch hover effect"
      }
    },
    "staggerAnimations": {
      "staggerCard": {
        "baseDelay": "0s",
        "card1": "0s",
        "card2": "0.05s",
        "card3": "0.1s",
        "timing": "0.3s ease-out",
        "usage": "Staggered card animations (50ms between cards)"
      },
      "staggerLayoutCard": {
        "baseDelay": "0s",
        "card1": "0s",
        "card2": "0.15s",
        "card3": "0.3s",
        "timing": "0.6s ease-out",
        "usage": "Staggered layout card animations (150ms between cards)"
      }
    },
    "filmstripAnimation": {
      "scrollDriven": {
        "description": "Horizontal scroll follows vertical scroll position",
        "transform": "translateX(calculated based on scroll progress)",
        "calculation": "-distance * progress where distance = max scroll distance needed",
        "usage": "Filmstrip scrolls horizontally as user scrolls vertically"
      },
      "progressBar": {
        "transform": "scaleX(progress)",
        "timing": "0.1s linear",
        "origin": "left",
        "gradient": "linear-gradient(90deg, var(--burnt), var(--rose))"
      }
    },
    "parallax": {
      "heroImage": {
        "factor": 0.12,
        "calculation": "window.scrollY * 0.12",
        "usage": "Subtle hero image parallax effect"
      },
      "maxParallax": {
        "limit": "5%",
        "note": "Parallax limited to 5% translateY for subtlety"
      }
    },
    "keyframes": {
      "float": {
        "0%": "transform: translateY(0px)",
        "50%": "transform: translateY(-6px)",
        "100%": "transform: translateY(0px)",
        "usage": "Floating element animation"
      }
    }
  },
  "components": {
    "button": {
      "description": "Interactive button component for primary actions, secondary options, and ghost links",
      "element": "button",
      "className": "demo-btn",
      "structure": {
        "element": "button.demo-btn",
        "padding": "1rem 1.6rem",
        "borderRadius": "12px",
        "fontSize": "0.85rem",
        "fontWeight": 500,
        "textTransform": "uppercase",
        "letterSpacing": "0.2em",
        "border": "none",
        "cursor": "pointer",
        "transition": "transform 0.2s ease, box-shadow 0.2s ease"
      },
      "variations": {
        "primary": {
          "className": "demo-btn.primary",
          "background": "var(--burnt)",
          "color": "#fff",
          "boxShadow": "0 10px 22px rgba(186, 75, 47, 0.25)",
          "usage": "Primary calls-to-action (Begin Commission, Submit Brief)",
          "hoverState": "scale(1.05) translateY(-1px), shadow: 0 12px 24px"
        },
        "secondary": {
          "className": "demo-btn.secondary",
          "background": "var(--terracotta)",
          "color": "#fff",
          "boxShadow": "0 10px 22px rgba(216, 120, 80, 0.25)",
          "usage": "Secondary actions (View Portfolio)",
          "hoverState": "translateY(-1px), shadow: 0 8px 16px"
        },
        "ghost": {
          "className": "demo-btn.ghost",
          "background": "var(--sand)",
          "border": "1px solid rgba(31, 27, 23, 0.25)",
          "color": "var(--ink)",
          "boxShadow": "none",
          "usage": "Tertiary actions, secondary links (Ghost Link, Download PDF)",
          "hoverState": "translateY(-1px)"
        }
      },
      "states": {
        "default": "Static button state",
        "hover": "Scale to 105%, shadow bloom, slight elevation",
        "focus": "outline: 2px solid var(--rose), outline-offset: 3px",
        "active": "Scale up with enhanced shadow"
      },
      "accessibility": {
        "focusVisible": "outline: 2px solid var(--rose), outline-offset: 3px",
        "textContrast": "Primary: white on burnt (high contrast)",
        "minHeight": "44px recommended for touch targets"
      }
    },
    "card": {
      "description": "Card component for containing grouped content",
      "variations": {
        "dataCard": {
          "element": ".data-card",
          "background": "linear-gradient(135deg, rgba(242, 227, 208, 0.95), rgba(255, 247, 236, 0.9))",
          "borderRadius": "22px",
          "padding": "1.8rem",
          "border": "1px solid rgba(122, 139, 139, 0.2)",
          "boxShadow": "0 20px 35px rgba(31, 27, 23, 0.1)",
          "usage": "Color language, typography, voice notes, reference sections"
        },
        "componentCard": {
          "element": ".component-card",
          "borderRadius": "18px",
          "padding": "1.6rem",
          "background": "rgba(255, 255, 255, 0.88)",
          "border": "1px solid rgba(31, 27, 23, 0.08)",
          "usage": "Smaller component showcases"
        },
        "motionExampleCard": {
          "element": ".motion-example-card-enhanced",
          "padding": "2rem",
          "borderRadius": "20px",
          "background": "linear-gradient(135deg, rgba(255, 247, 236, 0.95), rgba(242, 227, 208, 0.9))",
          "border": "1px solid rgba(122, 139, 139, 0.25)",
          "boxShadow": "0 12px 28px rgba(31, 27, 23, 0.1)",
          "hoverState": "translateY(-2px), shadow: 0 16px 36px",
          "usage": "Motion and interaction example demonstrations"
        },
        "scrollStep": {
          "element": ".scroll-step",
          "background": "rgba(255, 255, 255, 0.92)",
          "borderRadius": "20px",
          "padding": "1.6rem",
          "border": "1px solid rgba(31, 27, 23, 0.08)",
          "boxShadow": "0 18px 28px rgba(31, 27, 23, 0.06)",
          "usage": "Sequential scroll-based content"
        },
        "stickyPanel": {
          "element": ".sticky-panel",
          "position": "sticky",
          "top": "2rem",
          "background": "rgba(255, 255, 255, 0.95)",
          "borderRadius": "22px",
          "padding": "1.8rem",
          "border": "1px solid rgba(31, 27, 23, 0.12)",
          "boxShadow": "0 25px 40px rgba(31, 27, 23, 0.08)",
          "usage": "Sticky sidebars in scroll narratives"
        }
      }
    },
    "form": {
      "description": "Form components for user input",
      "container": {
        "element": ".form-demo",
        "borderRadius": "22px",
        "padding": "2.2rem 2.5rem",
        "background": "linear-gradient(135deg, rgba(242, 227, 208, 0.98), rgba(255, 247, 236, 0.95))",
        "border": "1px solid rgba(210, 106, 50, 0.2)",
        "display": "grid",
        "gap": "1.5rem",
        "boxShadow": "0 14px 24px rgba(31, 27, 23, 0.18)",
        "color": "rgba(31, 27, 23, 0.9)"
      },
      "row": {
        "element": ".form-row",
        "display": "grid",
        "gridTemplateColumns": "repeat(auto-fit, minmax(200px, 1fr))",
        "gap": "1.2rem"
      },
      "field": {
        "element": ".form-field",
        "display": "flex",
        "flexDirection": "column"
      },
      "label": {
        "display": "block",
        "fontSize": "0.75rem",
        "fontWeight": 600,
        "letterSpacing": "0.25em",
        "textTransform": "uppercase",
        "color": "rgba(31, 27, 23, 0.7)",
        "marginBottom": "0.5rem"
      },
      "input": {
        "width": "100%",
        "borderRadius": "12px",
        "border": "1px solid rgba(210, 106, 50, 0.25)",
        "padding": "1rem 1.2rem",
        "fontSize": "0.95rem",
        "fontWeight": 500,
        "background": "rgba(255, 255, 255, 0.9)",
        "color": "rgba(31, 27, 23, 0.9)",
        "transition": "border 0.2s ease, box-shadow 0.2s ease",
        "placeholder": "rgba(31, 27, 23, 0.5)"
      },
      "inputFocus": {
        "outline": "none",
        "borderColor": "var(--terracotta)",
        "boxShadow": "0 0 0 3px rgba(210, 106, 50, 0.2)",
        "background": "rgba(255, 255, 255, 0.95)"
      },
      "helper": {
        "fontSize": "0.8rem",
        "fontWeight": 500,
        "lineHeight": 1.5,
        "color": "rgba(31, 27, 23, 0.65)",
        "usage": "Helper text below form fields"
      }
    },
    "toast": {
      "description": "Toast notification component for feedback messages",
      "element": ".toast",
      "container": {
        "borderRadius": "14px",
        "padding": "1.2rem 1.5rem",
        "display": "flex",
        "alignItems": "center",
        "gap": "1.2rem",
        "color": "#fff",
        "boxShadow": "0 14px 24px rgba(31, 27, 23, 0.18)"
      },
      "variations": {
        "success": {
          "className": "toast.success",
          "background": "var(--sage)",
          "icon": "✓",
          "usage": "Deposit received, confirmation messages"
        },
        "alert": {
          "className": "toast.alert",
          "background": "var(--rose)",
          "icon": "!",
          "usage": "Waitlist updates, alerts, warnings"
        }
      },
      "icon": {
        "element": ".toast-icon",
        "width": "32px",
        "height": "32px",
        "borderRadius": "8px",
        "background": "rgba(255, 255, 255, 0.25)",
        "display": "grid",
        "placeItems": "center",
        "fontWeight": 600
      }
    },
    "calendar": {
      "description": "Calendar component for booking/scheduling display",
      "container": {
        "element": ".calendar-demo",
        "borderRadius": "20px",
        "padding": "1.8rem 2rem",
        "background": "linear-gradient(135deg, rgba(242, 227, 208, 0.98), rgba(255, 247, 236, 0.95))",
        "border": "1px solid rgba(210, 106, 50, 0.2)",
        "width": "100%",
        "boxShadow": "0 14px 24px rgba(31, 27, 23, 0.18)",
        "color": "rgba(31, 27, 23, 0.9)"
      },
      "grid": {
        "element": ".calendar-grid",
        "display": "grid",
        "gridTemplateColumns": "repeat(7, minmax(0, 1fr))",
        "gap": "0.4rem",
        "marginTop": "1.2rem"
      },
      "day": {
        "element": ".calendar-day",
        "aspectRatio": "1 / 1",
        "borderRadius": "8px",
        "background": "rgba(255, 255, 255, 0.8)",
        "border": "1px solid rgba(210, 106, 50, 0.2)",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "center",
        "fontSize": "0.75rem",
        "fontWeight": 500,
        "color": "rgba(31, 27, 23, 0.8)"
      },
      "dayBooked": {
        "className": "calendar-day.is-booked",
        "background": "var(--terracotta)",
        "border": "none",
        "color": "#fff",
        "boxShadow": "0 10px 18px rgba(216, 120, 80, 0.3)"
      },
      "dayMuted": {
        "className": "calendar-day.is-muted",
        "opacity": 0.4,
        "usage": "Past or unavailable dates"
      },
      "legend": {
        "booked": "Terracotta background with white text",
        "open": "White background with border",
        "past": "White background with border and reduced opacity"
      }
    },
    "swatch": {
      "description": "Color swatch component for displaying color palette",
      "element": ".swatch",
      "borderRadius": "24px",
      "padding": "1.6rem",
      "color": "#fff",
      "minHeight": "220px",
      "display": "flex",
      "flexDirection": "column",
      "justifyContent": "space-between",
      "fontWeight": 600,
      "letterSpacing": "0.05em",
      "structure": {
        "strong": {
          "fontSize": "1.2rem",
          "usage": "Hex color value"
        },
        "span": {
          "fontSize": "0.9rem",
          "opacity": 0.9,
          "usage": "Color name"
        },
        "small": {
          "fontSize": "0.75rem",
          "letterSpacing": "0.15em",
          "textTransform": "uppercase",
          "opacity": 0.85,
          "usage": "Usage description"
        }
      },
      "hoverState": {
        "transform": "scale(1.1)",
        "timing": "0.2s ease"
      }
    },
    "filmstrip": {
      "description": "Horizontal scrollable gallery component with scroll-driven animation",
      "container": {
        "element": ".filmstrip-wrapper",
        "marginTop": "1.5rem",
        "position": "sticky",
        "top": 0,
        "height": "100vh",
        "display": "flex",
        "alignItems": "center",
        "overflow": "hidden",
        "width": "100vw"
      },
      "track": {
        "element": ".filmstrip",
        "display": "flex",
        "gap": "clamp(0.4rem, 0.6vw, 0.8rem)",
        "willChange": "transform",
        "padding": "0 clamp(0.5rem, 2vw, 1.5rem)",
        "animation": "Scroll-driven translateX animation"
      },
      "item": {
        "element": ".filmstrip-item",
        "borderRadius": "32px",
        "minWidth": "clamp(420px, 55vw, 820px)",
        "minHeight": "clamp(420px, 80vh, 780px)",
        "backgroundSize": "cover",
        "backgroundPosition": "center",
        "boxShadow": "0 40px 70px rgba(31, 27, 23, 0.25)",
        "overflow": "hidden",
        "label": "data-label attribute displayed in uppercase metadata"
      },
      "progressBar": {
        "element": ".filmstrip-progress-bar",
        "height": "2px",
        "background": "linear-gradient(90deg, var(--burnt), var(--rose))",
        "animation": "Driven by scroll progress"
      }
    },
    "layout": {
      "heroOverlay": {
        "element": ".hero-overlay",
        "width": "min(600px, 100%)",
        "maxWidth": "620px",
        "padding": "clamp(2rem, 4vw, 3.5rem)",
        "background": "rgba(242, 227, 208, 0.95)",
        "borderRadius": "24px",
        "border": "1px solid rgba(36, 27, 22, 0.15)",
        "boxShadow": "0 20px 40px rgba(36, 27, 22, 0.2)",
        "backdropFilter": "blur(12px) saturate(110%)",
        "textAlign": "center",
        "usage": "Main hero section content container"
      },
      "layoutExample": {
        "element": ".layout-example",
        "borderRadius": "28px",
        "overflow": "hidden",
        "boxShadow": "0 20px 40px rgba(31, 27, 23, 0.12), 0 0 0 1px rgba(122, 139, 139, 0.1)",
        "background": "rgba(255, 247, 236, 0.6)",
        "transition": "transform 0.3s ease, box-shadow 0.3s ease",
        "hoverState": "translateY(-6px), enhanced shadow",
        "figcaption": {
          "padding": "1.8rem 2rem",
          "background": "linear-gradient(180deg, rgba(255, 247, 236, 0.98), rgba(242, 227, 208, 0.95))",
          "fontSize": "0.95rem",
          "borderTop": "1px solid rgba(122, 139, 139, 0.2)"
        }
      },
      "identityPanel": {
        "element": ".identity-panel",
        "borderRadius": "24px",
        "padding": "1.6rem 2rem",
        "background": "linear-gradient(120deg, rgba(186, 75, 47, 0.18), rgba(90, 102, 95, 0.25))",
        "border": "1px solid rgba(31, 27, 23, 0.08)",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "space-between",
        "gap": "1.5rem",
        "flexWrap": "wrap"
      },
      "macroPanel": {
        "element": ".macro-panel",
        "marginTop": "1.5rem",
        "borderRadius": "24px",
        "backgroundImage": "linear-gradient(120deg, rgba(31, 27, 23, 0.4), rgba(255, 255, 255, 0)), url('./public/images/UP1_00012_.png')",
        "backgroundSize": "cover",
        "backgroundPosition": "center",
        "minHeight": "240px",
        "padding": "1.8rem",
        "color": "#fff",
        "boxShadow": "0 35px 55px rgba(31, 27, 23, 0.18)",
        "position": "relative",
        "overflow": "hidden",
        "label": "Content label via ::after pseudo-element"
      }
    }
  },
  "patterns": {
    "interactionPrinciples": {
      "baseline": [
        "Fade/slide reveals on scroll, 200-300ms, ease-out timing",
        "Buttons scale to 105% with shadow bloom; no bounce easing",
        "Link underlines draw from left to right like a painted stroke"
      ],
      "accentMoments": [
        "Parallax on hero imagery (limited to 5% translateY)",
        "Staggered card entrances of 50ms to mimic gallery walk-through",
        "Interactive swatches that tint background panels subtly on hover"
      ]
    },
    "scrollDrivenAnimation": {
      "description": "Filmstrip scrolls horizontally as user scrolls vertically",
      "implementation": "JavaScript tracks scroll progress and transforms filmstrip translateX",
      "progressBar": "Scales horizontally (scaleX) matching scroll progress"
    },
    "stickyLayout": {
      "description": "Sticky left sidebar paired with scrolling right content",
      "rules": [
        "Panel height <= 70vh with generous padding",
        "Use position: sticky with top: 2rem",
        "Mobile stacks vertically; sticky disengages below 720px"
      ]
    },
    "responsiveGallery": {
      "description": "Gallery pacing: alternate full-width blocks with modular cards",
      "principles": [
        "Spacious, staggered, editorial rhythm",
        "Horizontal galleries with framed imagery",
        "Salon-hang staggered rows"
      ]
    },
    "textureAndBackground": {
      "description": "Layered background effects mimicking sun-washed plaster",
      "layers": [
        "Base gradient: #7A8B8B to #F2E3D0",
        "Overlay gradient with multiple radial gradients for depth",
        "SVG grid texture with low opacity (0.25)",
        "Multiply blend mode for texture integration"
      ]
    },
    "mobileStickyOffset": {
      "variable": "--sticky-offset",
      "value": "clamp(3.5rem, 8vw, 6rem)",
      "usage": "Dynamic sticky positioning that responds to viewport"
    }
  },
  "tonAndMessaging": {
    "voice": [
      "ARTISTIC - Creative, gallery-influenced language",
      "BOLD - Confident statements about craft and process",
      "SOPHISTICATED - Elevated tone for luxury positioning",
      "ENERGETIC - Dynamic language paired with motion",
      "AUTHENTIC - Transparent about process and collaboration",
      "PROFESSIONAL - Polished, gallery-quality standards"
    ],
    "principles": [
      "Use sensory analogies ('sun-baked walls', 'charcoal whisper') to anchor visuals",
      "Keep call-to-actions confident but calm ('Begin Commission', 'Visit the Studio')",
      "Highlight collaboration and process transparency in every section",
      "Speak to seasoned collectors, not trend chasers",
      "Balance poetic descriptions with precise process language"
    ],
    "callToActions": {
      "primary": [
        "Begin Commission",
        "Submit Brief",
        "Request Consultation"
      ],
      "secondary": [
        "View Portfolio",
        "Visit the Studio",
        "Explore Process"
      ]
    }
  },
  "designPrinciples": {
    "visualLanguage": {
      "palette": "Burnt oranges, sage concrete, charcoal blacks, and off-whites that feel powdery and matte",
      "materiality": "Sun-washed plaster walls catching diagonal slant light",
      "photography": "Macro crops of plaster textures, charcoal studies, architectural details"
    },
    "typography": {
      "principle": "Type as carved etchings on plaster - precise, deliberate, never shouting",
      "headlines": "Museum placards feel: sculptural serif (Playfair Display)",
      "body": "Quiet grotesk (Space Grotesk) with generous tracking",
      "metadata": "Whisper-thin uppercase with letter spacing"
    },
    "spacing": {
      "rhythm": "Gallery pacing - spacious, staggered, editorial",
      "breathing": "Generous whitespace that feels intentional",
      "alignment": "Salon-hang staggered rows for imagery"
    },
    "motion": {
      "philosophy": "Every movement should feel deliberate, like brush strokes",
      "timing": "200-300ms fade/slide reveals with ease-out",
      "subtlety": "Parallax <= 5%, staggered entrances 50ms apart",
      "naturalness": "No bounce easing, smooth accelerations only"
    },
    "interaction": {
      "tactile": "Micro-interactions that feel physical and responsive",
      "feedback": "Clear visual feedback for all user actions",
      "confidence": "Actions feel intentional and reversible"
    }
  },
  "accessibility": {
    "colorContrast": {
      "primary": "Burnt orange/white meets WCAG AA standards",
      "text": "Charcoal ink (#241b16) on sand/cream backgrounds",
      "focus": "Rose outline (2px) with 3px offset"
    },
    "focusStates": {
      "button": "outline: 2px solid var(--rose), outline-offset: 3px",
      "link": "Rose underline with 300ms draw timing"
    },
    "minTouchTarget": "44px recommended for interactive elements",
    "semanticHtml": "Proper heading hierarchy (h1-h4), form labels associated with inputs",
    "mobileAccessibility": "Touch-friendly spacing, readable font sizes (min 16px), stacked layouts below 720px"
  },
  "implementation": {
    "cssVariables": {
      "--sand": "#f2e3d0",
      "--terracotta": "#d26a32",
      "--burnt": "#b0471e",
      "--rose": "#e59863",
      "--deep-olive": "#4a4034",
      "--sage": "#a28f79",
      "--ink": "#241b16",
      "--moss": "#6f5c49",
      "--cream": "#fff7ec",
      "--charcoal": "#1c1915",
      "--ambient-color": "rgba(178, 109, 70, 0.4)",
      "--sticky-offset": "clamp(3.5rem, 8vw, 6rem)"
    },
    "fontImports": "Google Fonts (Playfair Display, Space Grotesk)",
    "responsiveApproach": "Mobile-first with clamp() for fluid typography and spacing",
    "animationTriggers": "Intersection Observer API with 0.18 threshold for reveal animations",
    "scrollBehavior": "RequestAnimationFrame for smooth filmstrip and parallax animations"
  }
}

```

Here are the brand language guidelines:

```markdown
# United Tattoo Brand Language Guidelines

## Purpose

Filter out corporate bullshit. Sound like humans talking to humans.

## Core Principles

**Respect reader intelligence** - No big empty words that only impress idiots. Nobody wants to read something 5 times to understand it.

**Use common ground language** - Not corporate speak or legal jargon. 7th grade reading level maximum.

**Direct acknowledgment beats diplomatic deflection** - When you leave things unsaid, people internalize and make assumptions. Blunt but friendly prevents judgment feelings.

**Practical solutions over emotional theater** - We're not your fuckin dad. Beautiful humans interacting with beautiful humans, not therapy sessions.

## Language Rules

### 1. Plain speaking about pricing/process/time

**Good:** "Hey so because this is 6 inches long and I can tell that the complexity of the linework and shading is gonna take me an extra 2 hours, I'd feel comfortable doing this for $650, does that work for you?"

**Bad:** "We offer competitive pricing that reflects the artistry and expertise of our talented team"

### 2. Justified confidence only

If the artist, shop, portfolio or work can't justify the statement, don't make it.

**Good:** "I've been doing opaques on shading for 5 years, would you like to see some examples so you can judge for yourself?"

**Bad:** "93% proficient in opaques" or "Award-winning artists"

### 3. Honest about complexity

**Good:** "Pricing custom tattoos is hard. It depends on the artist and varies from one tattoo to the next."

**Bad:** Pretending everything is simple and straightforward when it's not.

### 4. Focus on artists and work, not the building

**Remember:** "The shop doesn't fucking matter. It's a building with some idiots in it. People only come for the idiots."

## Never Say

- "For the ones who live loud, tattoo proud, and believe in better"
- "This isn't your average tattoo shop"
- "We're here to rewrite the narrative"
- "Elevate the experience"
- "Create a space where real connection matters"
- "Bring both skill and soul to the table"
- "More than ink—it's identity"
- "Artistry with integrity"

These are all meaningless adjective stacking and corporate buzzword soup.

## Communication Standards

- **Meet but never exceed bare minimum professionalism**
- Use mild profanity naturally when it fits, not performatively
- Be vulnerable when it's honest ("I get scared sometimes even now")
- Offer practical actions ("take a smoke break, just hang out")
- No elaborate customer service scripts - handle difficult situations like a human

## Quick Transformations

**Corporate → United Tattoo**

"Artistry with integrity" → "We've been tattooing for [X years]. Here's our work."

"A space where creativity thrives" → "Artists who know what they're doing"

"More than ink—it's identity" → "Good tattoos that'll look good in 20 years"

## The Test

Before publishing anything, ask: **"Would a human being actually say this?"**

If not, rewrite it.
```

Here is a snippet of html which should serve as the main inspiration for this site:

```html
<div class="pagetransitionscript w-embed w-script">
  <style>
    .transition-curtain {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #c9c7c5;
      transform: translateY(-100%);
      z-index: 99998;
    }
    .transition-curtain.transition {
      transition: transform 1.2s cubic-bezier(0.54, 0.12, 0.47, 0.99);
    }
    .transition-curtain.delayed.transition {
      transition-delay: 0.4s;
    }
    .transition-curtain.top {
      z-index: 99999;
    }
    .transition-curtain.light {
      background-color: #f0efee;
    }
    .transition-curtain.shown {
      transform: translateY(0);
    }
    .transition-curtain.hidden {
      transform: translateY(100%);
    }
  </style>

  <script>
    !(function usePageTransition() {
      if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) return;
      const isTransitioning =
          "true" === window.sessionStorage.getItem("isTransitioning"),
        addCurtain = ({
          isShown: isShown = !1,
          isDelayed: isDelayed = !1,
          isLight: isLight = !1,
          isTop: isTop = !1,
        } = {}) => {
          const curtain = document.createElement("div");
          return (
            curtain.classList.add("transition-curtain"),
            isDelayed && curtain.classList.add("delayed"),
            isLight && curtain.classList.add("light"),
            isTop && curtain.classList.add("top"),
            isShown && curtain.classList.add("shown"),
            document.body.appendChild(curtain),
            new Promise((res) => {
              setTimeout(() => {
                (curtain.classList.add("transition"), res(curtain));
              });
            })
          );
        };
      function polling() {
        const isTransitioning =
          "true" === window.sessionStorage.getItem("isTransitioning");
        if (!isTransitioning) {
          const curtains = document.querySelectorAll(".transition-curtain");
          if (curtains && curtains.length)
            return void curtains.forEach((curtain) => {
              (curtain.classList.remove("delayed"),
                curtain.addEventListener("transitionend", curtain.remove),
                setTimeout(() => curtain.classList.add("hidden")));
            });
        }
        setTimeout(polling, 150);
      }
      (polling(),
        isTransitioning &&
          (addCurtain({ isShown: !0, isLight: !0, isTop: !0 }).then(
            (curtain) => {
              (curtain.addEventListener("transitionend", curtain.remove),
                curtain.classList.add("hidden"));
            },
          ),
          addCurtain({ isShown: !0, isDelayed: !0 }).then((curtain) => {
            (curtain.addEventListener("transitionend", curtain.remove),
              curtain.classList.add("hidden"));
          })));
      const transition = (url) => {
          (window.sessionStorage.setItem("isTransitioning", !0),
            addCurtain().then((curtain) => {
              curtain.classList.add("shown");
            }),
            addCurtain({ isDelayed: !0, isLight: !0, isTop: !0 }).then(
              (curtain) => {
                const transitionEnd = () => {
                  curtain.removeEventListener("transitionend", transitionEnd);
                  const onBeforeUnload = () => {
                    (setTimeout(() => {
                      window.sessionStorage.setItem("isTransitioning", !1);
                    }, 150),
                      window.removeEventListener(
                        "beforeunload",
                        onBeforeUnload,
                      ));
                  };
                  (window.addEventListener("beforeunload", onBeforeUnload),
                    (window.location.href = url));
                };
                (curtain.addEventListener("transitionend", transitionEnd),
                  curtain.classList.add("shown"));
              },
            ));
        },
        addTransitions = () => {
          const links = document.querySelectorAll("[animation-transition]");
          links.forEach((link) => {
            const url = link.getAttribute("href");
            link.addEventListener("click", (event) => {
              (event.preventDefault(), transition(url));
            });
          });
        };
      document.addEventListener("DOMContentLoaded", addTransitions);
    })();
  </script>
</div>
<div class="mobilenavigation">
  <div class="mobilemenucontainer">
    <div data-audiotrigger="true" class="soundwavesbutton mobile">
      <div
        id="w-node-_2759b8f3-207e-61ea-683d-7b49f7709499-586c9c2f"
        class="soundwavestick"
      ></div>
      <div class="soundwavestick"></div>
      <div class="soundwavestick"></div>
      <div class="soundwavestick"></div>
      <div class="soundwavestick"></div>
    </div>
    <div
      data-openspopup="mobilemenu"
      id="w-node-_2759b8f3-207e-61ea-683d-7b49f770949e-586c9c2f"
      class="mobilemenubutton"
    >
      <p class="mobilemenubuttontext">menu</p>
    </div>
  </div>
</div>
<div
  data-popupid="mobilemenu"
  id="w-node-d5555164-683e-71d0-a3eb-aadceacba1a6-586c9c2f"
  class="mobilemenu"
>
  <ul role="list" class="list-2 w-list-unstyled">
    <li class="list-item">
      <a href="#about" data-closepopup="true" class="mobilelink">about</a>
    </li>
    <li class="mobilemenulink">
      <a href="#portfolio" data-closepopup="true" class="mobilelink"
        >portfolio</a
      >
    </li>
    <li class="mobilemenulink">
      <a href="#reviews" data-closepopup="true" class="mobilelink">reviews</a>
    </li>
    <li class="mobilemenulink">
      <a href="#pre-care" data-closepopup="true" class="mobilelink">pre-care</a>
    </li>
    <li class="mobilemenulink">
      <a href="#contact" data-closepopup="true" class="mobilelink">contact</a>
    </li>
  </ul>
  <a
    animation-transition=""
    href="/request"
    target="_blank"
    class="mainbutton menu w-button"
    >send request</a
  ><link rel="prerender" href="/request" />
  <p class="paragraph-6">lass<br />Tattoo</p>
  <div class="mobilemenusocial mail">
    <p class="mobilemenusocialheader">Email</p>
    <a
      href="mailto:lasstattoo@gmail.com?subject=Request%20for%20tattoo"
      class="link-3"
      >lasstattoo@gmail.com</a
    >
  </div>
  <div class="mobilemenusocial instagram">
    <p class="mobilemenusocialheader">instagram</p>
    <a
      href="https://www.instagram.com/lasstattoo/"
      target="_blank"
      class="link-3"
      >@lasstattoo</a
    >
  </div>
  <div class="mobilemenucontaineropen">
    <div data-audiotrigger="true" class="soundwavesbutton mobile black">
      <div
        id="w-node-f50cadc6-47e1-c522-42fc-d3944d60c701-586c9c2f"
        class="soundwavestick black"
      ></div>
      <div class="soundwavestick black"></div>
      <div class="soundwavestick black"></div>
      <div class="soundwavestick black"></div>
      <div class="soundwavestick black"></div>
    </div>
    <div
      data-closepopup="true"
      id="w-node-f50cadc6-47e1-c522-42fc-d3944d60c706-586c9c2f"
      class="mobilemenubutton black"
    >
      <p class="mobilemenubuttontext">close</p>
    </div>
  </div>
</div>
<nav class="desktopnavigation">
  <div
    id="w-node-_5a454b97-7ada-0339-e3ac-94c85efded95-586c9c2f"
    class="desktopnavlinkcontainer"
  >
    <a
      href="#about"
      id="w-node-_8b38608f-3ed2-220e-056d-2eedc080b792-586c9c2f"
      class="desktopnavlink show-by-letter shown"
      ><span class="line"
        ><span class="word"
          ><span class="letter" style='--letter-index: 0; --letter: "a";'
            >a</span
          ><span class="letter" style='--letter-index: 1; --letter: "b";'
            >b</span
          ><span class="letter" style='--letter-index: 2; --letter: "o";'
            >o</span
          ><span class="letter" style='--letter-index: 3; --letter: "u";'
            >u</span
          ><span class="letter" style='--letter-index: 4; --letter: "t";'
            >t</span
          ></span
        ></span
      ></a
    >
  </div>
  <div
    id="w-node-_396cd9c6-ee64-55fb-73b9-970aee5fdd94-586c9c2f"
    class="desktopnavlinkcontainer"
  >
    <a
      href="#portfolio"
      id="w-node-_1e1f4ce9-33e4-7463-bcba-79f28431f1f6-586c9c2f"
      class="desktopnavlink show-by-letter shown"
      ><span class="line"
        ><span class="word"
          ><span class="letter" style='--letter-index: 0; --letter: "p";'
            >p</span
          ><span class="letter" style='--letter-index: 1; --letter: "o";'
            >o</span
          ><span class="letter" style='--letter-index: 2; --letter: "r";'
            >r</span
          ><span class="letter" style='--letter-index: 3; --letter: "t";'
            >t</span
          ><span class="letter" style='--letter-index: 4; --letter: "f";'
            >f</span
          ><span class="letter" style='--letter-index: 5; --letter: "o";'
            >o</span
          ><span class="letter" style='--letter-index: 6; --letter: "l";'
            >l</span
          ><span class="letter" style='--letter-index: 7; --letter: "i";'
            >i</span
          ><span class="letter" style='--letter-index: 8; --letter: "o";'
            >o</span
          ></span
        ></span
      ></a
    >
  </div>
  <div
    id="w-node-_5fc76770-5b6b-92d6-5972-b8e7b173b1d9-586c9c2f"
    class="desktopnavlinkcontainer"
  >
    <a
      href="#reviews"
      id="w-node-e485c1ee-fc0d-8697-ed32-1b79bcc73344-586c9c2f"
      class="desktopnavlink show-by-letter shown"
      ><span class="line"
        ><span class="word"
          ><span class="letter" style='--letter-index: 0; --letter: "r";'
            >r</span
          ><span class="letter" style='--letter-index: 1; --letter: "e";'
            >e</span
          ><span class="letter" style='--letter-index: 2; --letter: "v";'
            >v</span
          ><span class="letter" style='--letter-index: 3; --letter: "i";'
            >i</span
          ><span class="letter" style='--letter-index: 4; --letter: "e";'
            >e</span
          ><span class="letter" style='--letter-index: 5; --letter: "w";'
            >w</span
          ><span class="letter" style='--letter-index: 6; --letter: "s";'
            >s</span
          ></span
        ></span
      ></a
    >
  </div>
  <div
    id="w-node-_419fdd4a-bc6c-b3b0-184a-9ea43e82c8ea-586c9c2f"
    class="desktopnavlinkcontainer"
  >
    <a
      href="#pre-care"
      id="w-node-f7ec8c8b-9334-7a83-1e66-80997a5ff446-586c9c2f"
      class="desktopnavlink show-by-letter shown"
      ><span class="line"
        ><span class="word"
          ><span class="letter" style='--letter-index: 0; --letter: "p";'
            >p</span
          ><span class="letter" style='--letter-index: 1; --letter: "r";'
            >r</span
          ><span class="letter" style='--letter-index: 2; --letter: "e";'
            >e</span
          ><span class="letter" style='--letter-index: 3; --letter: "-";'
            >-</span
          ><span class="letter" style='--letter-index: 4; --letter: "c";'
            >c</span
          ><span class="letter" style='--letter-index: 5; --letter: "a";'
            >a</span
          ><span class="letter" style='--letter-index: 6; --letter: "r";'
            >r</span
          ><span class="letter" style='--letter-index: 7; --letter: "e";'
            >e</span
          ></span
        ></span
      ></a
    >
  </div>
  <div
    id="w-node-fddf3f0c-2765-d563-eb97-cbd26c23c90c-586c9c2f"
    class="desktopnavlinkcontainer"
  >
    <a
      href="#contact"
      id="w-node-d00f7ce2-92dc-8b50-c2e0-fda88d2bc3e6-586c9c2f"
      class="desktopnavlink show-by-letter shown"
      ><span class="line"
        ><span class="word"
          ><span class="letter" style='--letter-index: 0; --letter: "c";'
            >c</span
          ><span class="letter" style='--letter-index: 1; --letter: "o";'
            >o</span
          ><span class="letter" style='--letter-index: 2; --letter: "n";'
            >n</span
          ><span class="letter" style='--letter-index: 3; --letter: "t";'
            >t</span
          ><span class="letter" style='--letter-index: 4; --letter: "a";'
            >a</span
          ><span class="letter" style='--letter-index: 5; --letter: "c";'
            >c</span
          ><span class="letter" style='--letter-index: 6; --letter: "t";'
            >t</span
          ></span
        ></span
      ></a
    >
  </div>
  <div
    data-audiotrigger="true"
    id="w-node-_8bd8e393-c126-30fd-7978-d70b77a68fe8-586c9c2f"
    class="soundwavesbutton nav"
  >
    <div
      id="w-node-_8bd8e393-c126-30fd-7978-d70b77a68fe9-586c9c2f"
      class="soundwavestick"
    ></div>
    <div class="soundwavestick"></div>
    <div class="soundwavestick"></div>
    <div class="soundwavestick"></div>
    <div class="soundwavestick"></div>
  </div>
  <a
    animation-transition=""
    id="w-node-_3634ed12-9209-290d-063e-03b27704c74d-586c9c2f"
    href="/request"
    target="_blank"
    class="mainbuttonnav w-button show-by-letter shown"
    ><span class="line"
      ><span class="word"
        ><span class="letter" style='--letter-index: 0; --letter: "s";'>s</span
        ><span class="letter" style='--letter-index: 1; --letter: "e";'>e</span
        ><span class="letter" style='--letter-index: 2; --letter: "n";'>n</span
        ><span class="letter" style='--letter-index: 3; --letter: "d";'>d</span
        ><span class="letter"> </span></span
      ><span class="word"
        ><span class="letter" style='--letter-index: 4; --letter: "r";'>r</span
        ><span class="letter" style='--letter-index: 5; --letter: "e";'>e</span
        ><span class="letter" style='--letter-index: 6; --letter: "q";'>q</span
        ><span class="letter" style='--letter-index: 7; --letter: "u";'>u</span
        ><span class="letter" style='--letter-index: 8; --letter: "e";'>e</span
        ><span class="letter" style='--letter-index: 9; --letter: "s";'>s</span
        ><span class="letter" style='--letter-index: 10; --letter: "t";'
          >t</span
        ></span
      ></span
    ></a
  ><link rel="prerender" href="/request" />
</nav>
<div class="firstscreen">
  <ul
    id="w-node-_295a729a-0807-dc22-2ca8-298338d8d143-586c9c2f"
    role="list"
    class="mainminor menu w-list-unstyled"
  >
    <li>
      <a href="#about" class="link show-by-letter transition shown"
        ><span class="line"
          ><span class="word"
            ><span class="letter" style='--letter-index: 0; --letter: "A";'
              >A</span
            ><span class="letter" style='--letter-index: 1; --letter: "b";'
              >b</span
            ><span class="letter" style='--letter-index: 2; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 3; --letter: "u";'
              >u</span
            ><span class="letter" style='--letter-index: 4; --letter: "t";'
              >t</span
            ></span
          ></span
        ></a
      >
    </li>
    <li>
      <a href="#portfolio" class="link show-by-letter transition shown"
        ><span class="line"
          ><span class="word"
            ><span class="letter" style='--letter-index: 0; --letter: "p";'
              >p</span
            ><span class="letter" style='--letter-index: 1; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 2; --letter: "r";'
              >r</span
            ><span class="letter" style='--letter-index: 3; --letter: "t";'
              >t</span
            ><span class="letter" style='--letter-index: 4; --letter: "f";'
              >f</span
            ><span class="letter" style='--letter-index: 5; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 6; --letter: "l";'
              >l</span
            ><span class="letter" style='--letter-index: 7; --letter: "i";'
              >i</span
            ><span class="letter" style='--letter-index: 8; --letter: "o";'
              >o</span
            ></span
          ></span
        ></a
      >
    </li>
    <li>
      <a href="#reviews" class="link show-by-letter transition shown"
        ><span class="line"
          ><span class="word"
            ><span class="letter" style='--letter-index: 0; --letter: "r";'
              >r</span
            ><span class="letter" style='--letter-index: 1; --letter: "e";'
              >e</span
            ><span class="letter" style='--letter-index: 2; --letter: "v";'
              >v</span
            ><span class="letter" style='--letter-index: 3; --letter: "i";'
              >i</span
            ><span class="letter" style='--letter-index: 4; --letter: "e";'
              >e</span
            ><span class="letter" style='--letter-index: 5; --letter: "w";'
              >w</span
            ><span class="letter" style='--letter-index: 6; --letter: "s";'
              >s</span
            ></span
          ></span
        ></a
      >
    </li>
    <li>
      <a href="#pre-care" class="link show-by-letter transition shown"
        ><span class="line"
          ><span class="word"
            ><span class="letter" style='--letter-index: 0; --letter: "p";'
              >p</span
            ><span class="letter" style='--letter-index: 1; --letter: "r";'
              >r</span
            ><span class="letter" style='--letter-index: 2; --letter: "e";'
              >e</span
            ><span class="letter" style='--letter-index: 3; --letter: "-";'
              >-</span
            ><span class="letter" style='--letter-index: 4; --letter: "c";'
              >c</span
            ><span class="letter" style='--letter-index: 5; --letter: "a";'
              >a</span
            ><span class="letter" style='--letter-index: 6; --letter: "r";'
              >r</span
            ><span class="letter" style='--letter-index: 7; --letter: "e";'
              >e</span
            ></span
          ></span
        ></a
      >
    </li>
    <li>
      <a href="#contact" class="link show-by-letter shown"
        ><span class="line"
          ><span class="word"
            ><span class="letter" style='--letter-index: 0; --letter: "c";'
              >c</span
            ><span class="letter" style='--letter-index: 1; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 2; --letter: "n";'
              >n</span
            ><span class="letter" style='--letter-index: 3; --letter: "t";'
              >t</span
            ><span class="letter" style='--letter-index: 4; --letter: "a";'
              >a</span
            ><span class="letter" style='--letter-index: 5; --letter: "c";'
              >c</span
            ><span class="letter" style='--letter-index: 6; --letter: "t";'
              >t</span
            ></span
          ></span
        ></a
      >
    </li>
  </ul>
  <div
    id="w-node-_295a729a-0807-dc22-2ca8-298338d8d153-586c9c2f"
    class="firstscreencenter"
  >
    <p class="descriptor firstscreencentertext">
      I feel your energy and transfer it to the most expensive canvas in the
      world –
    </p>
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64242c423a81935b9277a365_your%20body.webp"
      loading="eager"
      width="142"
      alt="your body"
      class="image-21"
    /><a
      animation-transition=""
      animation-button="true"
      href="/request"
      target="_blank"
      class="mainbutton w-button"
      style="pointer-events: auto;"
      >send request</a
    ><link rel="prerender" href="/request" />
  </div>
  <div
    data-audiotrigger="true"
    id="w-node-a4a6ec5d-c0e7-efa3-eb3f-c9dd4ec1e756-586c9c2f"
    class="soundwavesbutton"
  >
    <div
      id="w-node-_7f7ebe2d-8789-f1fe-0d82-57be254f982e-586c9c2f"
      class="soundwavestick"
    ></div>
    <div class="soundwavestick"></div>
    <div class="soundwavestick"></div>
    <div class="soundwavestick"></div>
    <div class="soundwavestick"></div>
  </div>
  <div
    id="w-node-_61a2d86b-aedb-9cd5-aeae-bf7da8a9f8ed-586c9c2f"
    class="heading-1 firstscreentitle"
  >
    <p class="lass show-by-letter transition shown">
      <span class="line"
        ><span class="word"
          ><span class="letter" style="--letter-index: 0;">l</span
          ><span class="letter" style="--letter-index: 1;">a</span
          ><span class="letter" style="--letter-index: 2;">s</span
          ><span class="letter" style="--letter-index: 3;">s</span></span
        ></span
      >
    </p>
    <p class="tattoo show-by-letter transition shown">
      <span class="line"
        ><span class="word"
          ><span class="letter" style="--letter-index: 0;">t</span
          ><span class="letter" style="--letter-index: 1;">a</span
          ><span class="letter" style="--letter-index: 2;">t</span
          ><span class="letter" style="--letter-index: 3;">t</span
          ><span class="letter" style="--letter-index: 4;">o</span
          ><span class="letter" style="--letter-index: 5;">o</span></span
        ></span
      >
    </p>
  </div>
  <p
    id="w-node-_295a729a-0807-dc22-2ca8-298338d8d13f-586c9c2f"
    class="mainminor tatooartist"
    style="opacity: 1;"
  >
    <span>Tattoo artist<br />based in Hamburg</span>
  </p>
  <img
    src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6439726838ecfe823a612f3c_Frame%2091.png"
    loading="eager"
    sizes="(max-width: 479px) 70vw, (max-width: 767px) 55vw, 30vw"
    srcset="
      https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6439726838ecfe823a612f3c_Frame%2091-p-500.png 500w,
      https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6439726838ecfe823a612f3c_Frame%2091-p-800.png 800w,
      https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6439726838ecfe823a612f3c_Frame%2091.png       997w
    "
    alt=""
    class="mainflower"
  />
</div>
<div id="about" class="w-layout-grid gridblock aboutme">
  <div
    id="w-node-_03838076-8208-7701-b1d8-ee828566dea4-586c9c2f"
    class="blocktopline"
  ></div>
  <h2
    id="w-node-_7a483d7c-8015-02a1-1163-724ba02e5918-586c9c2f"
    class="blocktitle left"
  >
    about me
  </h2>
  <div
    id="w-node-_092e2ca7-6870-8943-6d9b-78272ea13813-586c9c2f"
    class="photowrapper noclip transition"
  >
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642446959109528f95a43fdd_lass1.webp"
      loading="lazy"
      id="w-node-e54f56d0-1771-3469-8565-318045cf3579-586c9c2f"
      animation-images=""
      alt="A picture of tattoo artist Lass in Hamburg"
      data-noclip="true"
    />
  </div>
  <img
    src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642457f8848c4a9ac4fa4201_Hey%2C%20I%E2%80%99m%20Lass!.svg"
    loading="lazy"
    id="w-node-_246f78c2-3076-54ad-1961-d4898e695aa2-586c9c2f"
    alt="Hey,I'm Lass!"
    class="image-3"
  />
  <div
    id="w-node-_9f9e3da2-6062-1731-c3dd-aa836301f2ba-586c9c2f"
    class="div-block-5"
  >
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642457f83d2c370a5ec7555c_And%20my%20main.svg"
      loading="lazy"
      alt="And my main"
      class="image-4"
    /><img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642457f9ff31b30f162891b1_inspiration%20is%20you..svg"
      loading="lazy"
      alt="inspiration is you"
      class="image-5"
    />
  </div>
  <p
    id="w-node-_9d8103b8-e849-86fd-a1c5-83a5a3c84e03-586c9c2f"
    class="main-text aboutleft"
  >
    I like to work with people and create something from zero what is going to
    stay forever on the human body. I do freehand and freestyle tattoos - it's
    about freedom and feeling.
  </p>
  <p
    id="w-node-_62d26b2c-1e11-ed03-f759-4ceb5f1040e8-586c9c2f"
    class="main-text aboutright"
  >
    Everyone has their own special energy's which i&nbsp;read in our first 15
    min when we meet: how you smile, how you speak, how you feel yourself.
    There&nbsp;comes an image in my head where i already&nbsp;can see the future
    design for your project.
  </p>
</div>
<div id="portfolio" class="w-layout-grid gridblock">
  <div
    id="w-node-_2650c281-d249-5047-2197-011b8eb03fc4-586c9c2f"
    class="blocktopline"
  ></div>
  <h2
    id="w-node-aadf7325-422c-df83-e37d-3a3b3fa6c736-586c9c2f"
    class="blocktitle right"
  >
    portfolio
  </h2>
  <div
    id="w-node-_94a457e1-fca5-2f07-1b04-332a8c6079a4-586c9c2f"
    class="storywrapper neckchain"
  >
    <div class="photowrapper transition">
      <img
        animation-images="true"
        class="image-23"
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246a98a54051cc50b806a1_T1.webp"
        alt="Botanic tattoo on arm made by tattoo artist Lass "
        sizes="(max-width: 479px) 100vw, 93vw"
        loading="lazy"
        srcset="
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246a98a54051cc50b806a1_T1-p-500.webp   500w,
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246a98a54051cc50b806a1_T1-p-800.webp   800w,
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246a98a54051cc50b806a1_T1-p-1080.webp 1080w,
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246a98a54051cc50b806a1_T1.webp        1322w
        "
      />
    </div>
    <div
      data-delay="4000"
      data-animation="slide"
      class="mobilepicslider w-slider"
      data-autoplay="false"
      data-easing="ease"
      data-hide-arrows="false"
      data-disable-swipe="false"
      data-autoplay-limit="0"
      data-nav-spacing="3"
      data-duration="500"
      data-infinite="true"
      role="region"
      aria-label="carousel"
    >
      <div class="mask-2 w-slider-mask" id="w-slider-mask-0">
        <div
          class="slide w-slide"
          aria-label="1 of 3"
          role="group"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246a98a54051cc50b806a1_T1.webp"
            loading="lazy"
            sizes="(max-width: 479px) 93vw, 100vw"
            srcset="
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246a98a54051cc50b806a1_T1-p-500.webp   500w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246a98a54051cc50b806a1_T1-p-800.webp   800w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246a98a54051cc50b806a1_T1-p-1080.webp 1080w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246a98a54051cc50b806a1_T1.webp        1322w
            "
            alt="Botanic tattoo on arm made by tattoo artist Lass "
            class="mobilesliderpic"
          />
        </div>
        <div
          class="w-slide"
          aria-label="2 of 3"
          role="group"
          aria-hidden="true"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246ad6585c92fc9f4e653b_t2.webp"
            loading="lazy"
            sizes="(max-width: 479px) 93vw, 100vw"
            srcset="
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246ad6585c92fc9f4e653b_t2-p-500.webp 500w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246ad6585c92fc9f4e653b_t2.webp       510w
            "
            alt="Leaves tattoo made by tattoo artist from Hamburg Lass"
            class="mobilesliderpic"
            aria-hidden="true"
          />
        </div>
        <div
          class="w-slide"
          aria-label="3 of 3"
          role="group"
          aria-hidden="true"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642470e2a54051f36db85af9_t3.webp"
            loading="lazy"
            sizes="(max-width: 479px) 93vw, 100vw"
            srcset="
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642470e2a54051f36db85af9_t3-p-500.webp 500w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642470e2a54051f36db85af9_t3.webp       510w
            "
            alt="Details of a botanic tattoo made by tattoo artist Lass from Hamburg"
            class="mobilesliderpic"
            aria-hidden="true"
          />
        </div>
        <div
          aria-live="off"
          aria-atomic="true"
          class="w-slider-aria-label"
          data-wf-ignore=""
        ></div>
      </div>
      <div
        class="mobilesliderarrow w-slider-arrow-left"
        role="button"
        tabindex="0"
        aria-controls="w-slider-mask-0"
        aria-label="previous slide"
      >
        <div class="w-icon-slider-left"></div>
      </div>
      <div
        class="mobilesliderarrow w-slider-arrow-right"
        role="button"
        tabindex="0"
        aria-controls="w-slider-mask-0"
        aria-label="next slide"
      >
        <div class="w-icon-slider-right"></div>
      </div>
      <div class="w-slider-nav w-round">
        <div
          class="w-slider-dot w-active"
          data-wf-ignore=""
          aria-label="Show slide 1 of 3"
          aria-pressed="true"
          role="button"
          tabindex="0"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
        <div
          class="w-slider-dot"
          data-wf-ignore=""
          aria-label="Show slide 2 of 3"
          aria-pressed="false"
          role="button"
          tabindex="-1"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
        <div
          class="w-slider-dot"
          data-wf-ignore=""
          aria-label="Show slide 3 of 3"
          aria-pressed="false"
          role="button"
          tabindex="-1"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
      </div>
    </div>
    <div
      animation-flip-trigger=""
      data-openspopup="linda"
      class="picturecaption"
    >
      <div animation-flip="" class="main-text show-by-letter shown">
        <span class="line"
          ><span class="word"
            ><span class="letter" style='--letter-index: 0; --letter: "T";'
              >T</span
            ><span class="letter" style='--letter-index: 1; --letter: "h";'
              >h</span
            ><span class="letter" style='--letter-index: 2; --letter: "e";'
              >e</span
            ><span class="letter"> </span></span
          ><span class="word"
            ><span class="letter" style='--letter-index: 3; --letter: "S";'
              >S</span
            ><span class="letter" style='--letter-index: 4; --letter: "y";'
              >y</span
            ><span class="letter" style='--letter-index: 5; --letter: "m";'
              >m</span
            ><span class="letter" style='--letter-index: 6; --letter: "b";'
              >b</span
            ><span class="letter" style='--letter-index: 7; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 8; --letter: "l";'
              >l</span
            ><span class="letter"> </span></span
          ><span class="word"
            ><span class="letter" style='--letter-index: 9; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 10; --letter: "f";'
              >f</span
            ><span class="letter"> </span></span
          ><span class="word"
            ><span class="letter" style='--letter-index: 11; --letter: "F";'
              >F</span
            ><span class="letter" style='--letter-index: 12; --letter: "r";'
              >r</span
            ><span class="letter" style='--letter-index: 13; --letter: "e";'
              >e</span
            ><span class="letter" style='--letter-index: 14; --letter: "e";'
              >e</span
            ><span class="letter" style='--letter-index: 15; --letter: "d";'
              >d</span
            ><span class="letter" style='--letter-index: 16; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 17; --letter: "m";'
              >m</span
            ></span
          ></span
        >
      </div>
      <img
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6424735e8ad857e1795cd4d6_arrow.svg"
        loading="lazy"
        alt=""
        class="image-6"
      />
    </div>
  </div>
  <div
    id="w-node-_637e2057-1c86-e4f5-ece9-17f211b3d788-586c9c2f"
    class="photowrapper disableonmobile transition"
  >
    <img
      animation-images="true"
      class="image-32"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246ad6585c92fc9f4e653b_t2.webp"
      alt="Leaves tattoo made by tattoo artist from Hamburg Lass"
      sizes="(max-width: 479px) 100vw, 93vw"
      id="w-node-_472f6383-1eaf-6b4f-81b3-1cc3bbadacfc-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246ad6585c92fc9f4e653b_t2-p-500.webp 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64246ad6585c92fc9f4e653b_t2.webp       510w
      "
    />
  </div>
  <div
    id="w-node-_21eddd72-32c1-d339-c532-55f30bd7c1ff-586c9c2f"
    class="photowrapper disableonmobile transition"
  >
    <img
      animation-images="true"
      class="image-33"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642470e2a54051f36db85af9_t3.webp"
      alt="Details of a botanic tattoo made by tattoo artist Lass from Hamburg"
      sizes="(max-width: 479px) 100vw, 93vw"
      id="w-node-_30536c0e-e8c6-a7d1-669d-269bbbc7a1f8-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642470e2a54051f36db85af9_t3-p-500.webp 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642470e2a54051f36db85af9_t3.webp       510w
      "
    />
  </div>
  <div
    id="w-node-e72d9915-7947-c261-cc2f-5fbf23ad17ad-586c9c2f"
    class="sensitivelyaboutyou w-clearfix"
  >
    <p
      animation-letters="true"
      class="heading-2 grey sencitively desktop show-by-letter transition shown"
      style="--anim-time: 0.8s;"
    >
      <span class="line"
        ><span class="word"
          ><span class="letter" style="--letter-index: 0;">s</span
          ><span class="letter" style="--letter-index: 1;">e</span
          ><span class="letter" style="--letter-index: 2;">n</span
          ><span class="letter" style="--letter-index: 3;">s</span
          ><span class="letter" style="--letter-index: 4;">i</span
          ><span class="letter" style="--letter-index: 5;">t</span
          ><span class="letter" style="--letter-index: 6;">i</span
          ><span class="letter" style="--letter-index: 7;">v</span
          ><span class="letter" style="--letter-index: 8;">e</span
          ><span class="letter" style="--letter-index: 9;">l</span
          ><span class="letter" style="--letter-index: 10;">y</span></span
        ></span
      >
    </p>
    <div
      animation-letters=""
      class="heading-2 grey sencitively mobile show-by-letter"
      style="--anim-time: 0.8s;"
    >
      <p>
        <span class="line"
          ><span class="word"
            ><span class="letter" style="--letter-index: 0;">s</span
            ><span class="letter" style="--letter-index: 1;">e</span
            ><span class="letter" style="--letter-index: 2;">n</span
            ><span class="letter" style="--letter-index: 3;">s</span
            ><span class="letter" style="--letter-index: 4;">i</span
            ><span class="letter" style="--letter-index: 5;">-</span></span
          ></span
        >
      </p>
      <p class="text-span-2">
        <span class="line"
          ><span class="word"
            ><span class="letter" style="--letter-index: 6;">t</span
            ><span class="letter" style="--letter-index: 7;">i</span
            ><span class="letter" style="--letter-index: 8;">v</span
            ><span class="letter" style="--letter-index: 9;">e</span
            ><span class="letter" style="--letter-index: 10;">l</span
            ><span class="letter" style="--letter-index: 11;">y</span></span
          ></span
        >
      </p>
    </div>
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642bee9bdcd54d94bae7a350_about%20you.svg"
      loading="lazy"
      width="407"
      height="166"
      alt="about you"
      class="image-7"
    />
  </div>
  <div
    id="w-node-e7c35d03-db06-c014-9f1a-d499ffccf594-586c9c2f"
    class="photowrapper hiddenontablet transition"
  >
    <img
      animation-images="true"
      class="image-30"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642565e097e0b182da392fd9_t4.webp"
      alt="Floral tattoo made by tattoo artist Lazzat from Hamburg"
      sizes="(max-width: 479px) 93vw, (max-width: 991px) 100vw, 93vw"
      id="w-node-_5f835768-e443-ecfa-c656-fb7c0da0cda3-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642565e097e0b182da392fd9_t4-p-500.webp 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642565e097e0b182da392fd9_t4.webp       510w
      "
    />
  </div>
  <div
    id="w-node-d648fc5e-debf-bbcc-c538-de1ff4cce251-586c9c2f"
    class="photowrapper disableonmobile transition"
  >
    <img
      animation-images="true"
      class="image-31"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ef487591341adf84f_t20.webp"
      alt="Floral tattoo with Japanese motives made by tattoo artist Lass from Hamburg"
      sizes="(max-width: 479px) 100vw, 93vw"
      id="w-node-ec44db35-4e1d-25e4-06e8-6cede8ed80c9-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ef487591341adf84f_t20-p-500.webp 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ef487591341adf84f_t20.webp       510w
      "
    />
  </div>
  <div
    id="w-node-_9dcf03de-669e-83af-432c-ed51a099ada7-586c9c2f"
    class="photowrapper disableonmobile transition"
  >
    <img
      animation-images="true"
      class="image-34"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ff487590fd3adf865_t19.webp"
      alt="A big picture of a floral tattoo art made my Lass, artist from Hamburg"
      sizes="(max-width: 479px) 100vw, 93vw"
      id="w-node-c765be65-9fb9-6bed-11f9-3bd0efab4c87-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ff487590fd3adf865_t19-p-500.webp   500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ff487590fd3adf865_t19-p-800.webp   800w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ff487590fd3adf865_t19-p-1080.webp 1080w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ff487590fd3adf865_t19.webp        1322w
      "
    />
  </div>
  <div
    id="w-node-bf37b2f1-41d0-c98d-aff7-abef8a2c6492-586c9c2f"
    class="storywrapper sideboob"
  >
    <div
      data-delay="4000"
      data-animation="slide"
      class="mobilepicslider w-slider"
      data-autoplay="false"
      data-easing="ease"
      data-hide-arrows="false"
      data-disable-swipe="false"
      data-autoplay-limit="0"
      data-nav-spacing="3"
      data-duration="500"
      data-infinite="true"
      role="region"
      aria-label="carousel"
    >
      <div class="mask-2 w-slider-mask" id="w-slider-mask-1">
        <div
          class="slide w-slide"
          aria-label="1 of 3"
          role="group"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ff487590fd3adf865_t19.webp"
            loading="lazy"
            sizes="(max-width: 479px) 93vw, 100vw"
            srcset="
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ff487590fd3adf865_t19-p-500.webp   500w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ff487590fd3adf865_t19-p-800.webp   800w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ff487590fd3adf865_t19-p-1080.webp 1080w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ff487590fd3adf865_t19.webp        1322w
            "
            alt="A big picture of a floral tattoo art made my Lass, artist from Hamburg"
            class="mobilesliderpic"
          />
        </div>
        <div
          class="w-slide"
          aria-label="2 of 3"
          role="group"
          aria-hidden="true"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ef487591341adf84f_t20.webp"
            loading="lazy"
            sizes="(max-width: 479px) 93vw, 100vw"
            srcset="
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ef487591341adf84f_t20-p-500.webp 500w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6428173ef487591341adf84f_t20.webp       510w
            "
            alt="Floral tattoo with Japanese motives made by tattoo artist Lass from Hamburg"
            class="mobilesliderpic"
            aria-hidden="true"
          />
        </div>
        <div
          class="w-slide"
          aria-label="3 of 3"
          role="group"
          aria-hidden="true"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643024b63433e51496db594d_seeweed.webp"
            loading="lazy"
            sizes="(max-width: 479px) 93vw, 100vw"
            srcset="
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643024b63433e51496db594d_seeweed-p-500.webp 500w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643024b63433e51496db594d_seeweed.webp       506w
            "
            alt="Floral tattoo with Japanese motives made by tattoo artist Lass from Hamburg"
            class="mobilesliderpic"
            aria-hidden="true"
          />
        </div>
        <div
          aria-live="off"
          aria-atomic="true"
          class="w-slider-aria-label"
          data-wf-ignore=""
        ></div>
      </div>
      <div
        class="mobilesliderarrow w-slider-arrow-left"
        role="button"
        tabindex="0"
        aria-controls="w-slider-mask-1"
        aria-label="previous slide"
      >
        <div class="w-icon-slider-left"></div>
      </div>
      <div
        class="mobilesliderarrow w-slider-arrow-right"
        role="button"
        tabindex="0"
        aria-controls="w-slider-mask-1"
        aria-label="next slide"
      >
        <div class="w-icon-slider-right"></div>
      </div>
      <div class="w-slider-nav w-round">
        <div
          class="w-slider-dot w-active"
          data-wf-ignore=""
          aria-label="Show slide 1 of 3"
          aria-pressed="true"
          role="button"
          tabindex="0"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
        <div
          class="w-slider-dot"
          data-wf-ignore=""
          aria-label="Show slide 2 of 3"
          aria-pressed="false"
          role="button"
          tabindex="-1"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
        <div
          class="w-slider-dot"
          data-wf-ignore=""
          aria-label="Show slide 3 of 3"
          aria-pressed="false"
          role="button"
          tabindex="-1"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
      </div>
    </div>
  </div>
  <img
    src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661207707d0e5c0b629e_t8.webp"
    loading="lazy"
    id="w-node-a299e2f9-168a-f817-7812-7dcc44b88b8c-586c9c2f"
    sizes="(max-width: 479px) 93vw, 100vw"
    alt="A beautiful floral art on arm made by Lass tattoo artist from Hamburg"
    srcset="
      https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661207707d0e5c0b629e_t8-p-500.webp 500w,
      https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661207707d0e5c0b629e_t8.webp       510w
    "
    class="image-29"
  />
  <div
    id="w-node-d6d7b8dd-5600-3a15-4d88-f6995c0b6b17-586c9c2f"
    class="photowrapper disableexceptmobile"
  ></div>
  <div
    id="w-node-e39bea7f-4774-fa88-74c2-669a9c75410c-586c9c2f"
    class="photowrapper hiddenontablet transition"
  >
    <div
      data-poster-url="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6430188741abf131f0fb8694_vidtattoo-poster-00001.jpg"
      data-video-urls="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6430188741abf131f0fb8694_vidtattoo-transcode.mp4,https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6430188741abf131f0fb8694_vidtattoo-transcode.webm"
      data-autoplay="true"
      data-loop="true"
      data-wf-ignore="true"
      animation-images="true"
      id="w-node-bd564391-4fb3-7b68-2b22-e77650671095-586c9c2f"
      class="background-video-6 w-background-video w-background-video-atom"
    >
      <video
        id="bd564391-4fb3-7b68-2b22-e77650671095-video"
        autoplay=""
        loop=""
        style='background-image:url("https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6430188741abf131f0fb8694_vidtattoo-poster-00001.jpg")'
        muted=""
        playsinline=""
        data-wf-ignore="true"
        data-object-fit="cover"
      >
        <source
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6430188741abf131f0fb8694_vidtattoo-transcode.mp4"
          data-wf-ignore="true"
        />
        <source
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6430188741abf131f0fb8694_vidtattoo-transcode.webm"
          data-wf-ignore="true"
        />
      </video>
    </div>
  </div>
  <div
    id="w-node-eba9dc50-2a38-7902-0384-8d3a6d91ccf3-586c9c2f"
    class="photowrapper transition"
  >
    <img
      animation-images="true"
      class="image-25"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64256612943fc8df94df7968_t9.webp"
      alt="A beautiful floral tattoo art made by Lass Tattoo"
      sizes="93vw"
      id="w-node-_94fbef1f-eeb9-992f-80ba-3f56d386a2bb-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64256612943fc8df94df7968_t9-p-500.webp 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64256612943fc8df94df7968_t9.webp       780w
      "
    />
  </div>
  <div
    id="w-node-_79df6b3e-34a9-3a11-fe40-56a860cd6422-586c9c2f"
    class="photowrapper hiddenontablet transition"
  >
    <img
      animation-images="true"
      class="image-28"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64256e1a4c4089ef8e7be0aa_t17.png"
      alt="A beautiful floral tattoo art made by Lass Tattoo"
      sizes="(max-width: 479px) 93vw, (max-width: 991px) 100vw, 93vw"
      id="w-node-b09bafa9-aa84-5530-6a48-3e74b77b2faa-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64256e1a4c4089ef8e7be0aa_t17-p-500.png 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64256e1a4c4089ef8e7be0aa_t17.png       510w
      "
    />
  </div>
  <div
    id="w-node-_6b39e813-eaf8-4ef9-363b-030e61051df0-586c9c2f"
    class="storywrapper"
  >
    <div class="photowrapper transition">
      <img
        animation-images="true"
        class="image-35"
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661222874b79d76c1e29_t11.webp"
        alt="Botanical tattoo on arm made by tattoo artist from Hamburg Lass"
        sizes="(max-width: 479px) 100vw, 93vw"
        id="w-node-_74e16a15-02bb-e88c-4591-2fd458cffffe-586c9c2f"
        loading="lazy"
        srcset="
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661222874b79d76c1e29_t11-p-500.webp 500w,
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661222874b79d76c1e29_t11.webp       780w
        "
      />
    </div>
    <div
      data-delay="4000"
      data-animation="slide"
      class="mobilepicslider botanical w-slider"
      data-autoplay="false"
      data-easing="ease"
      data-hide-arrows="false"
      data-disable-swipe="false"
      data-autoplay-limit="0"
      data-nav-spacing="3"
      data-duration="500"
      data-infinite="true"
      role="region"
      aria-label="carousel"
    >
      <div class="mask-2 w-slider-mask" id="w-slider-mask-2">
        <div
          class="slide w-slide"
          aria-label="1 of 2"
          role="group"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64302573c759f480e166f39d_botanical.webp"
            loading="lazy"
            alt="Botanical tattoo on arm made by tattoo artist from Hamburg Lass"
            class="mobilesliderpic"
          />
        </div>
        <div
          class="w-slide"
          aria-label="2 of 2"
          role="group"
          aria-hidden="true"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661222874b79d76c1e29_t11.webp"
            loading="lazy"
            sizes="(max-width: 479px) 93vw, 100vw"
            srcset="
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661222874b79d76c1e29_t11-p-500.webp 500w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661222874b79d76c1e29_t11.webp       780w
            "
            alt="Botanical tattoo on arm made by tattoo artist from Hamburg Lass"
            class="mobilesliderpic"
            aria-hidden="true"
          />
        </div>
        <div
          aria-live="off"
          aria-atomic="true"
          class="w-slider-aria-label"
          data-wf-ignore=""
        ></div>
      </div>
      <div
        class="mobilesliderarrow w-slider-arrow-left"
        role="button"
        tabindex="0"
        aria-controls="w-slider-mask-2"
        aria-label="previous slide"
      >
        <div class="w-icon-slider-left"></div>
      </div>
      <div
        class="mobilesliderarrow w-slider-arrow-right"
        role="button"
        tabindex="0"
        aria-controls="w-slider-mask-2"
        aria-label="next slide"
      >
        <div class="w-icon-slider-right"></div>
      </div>
      <div class="w-slider-nav w-round">
        <div
          class="w-slider-dot w-active"
          data-wf-ignore=""
          aria-label="Show slide 1 of 2"
          aria-pressed="true"
          role="button"
          tabindex="0"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
        <div
          class="w-slider-dot"
          data-wf-ignore=""
          aria-label="Show slide 2 of 2"
          aria-pressed="false"
          role="button"
          tabindex="-1"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
      </div>
    </div>
    <div
      animation-flip-trigger=""
      data-openspopup="katharina"
      class="picturecaption"
    >
      <div animation-flip="" class="main-text show-by-letter shown">
        <span class="line"
          ><span class="word"
            ><span class="letter" style='--letter-index: 0; --letter: "A";'
              >A</span
            ><span class="letter"> </span></span
          ><span class="word"
            ><span class="letter" style='--letter-index: 1; --letter: "C";'
              >C</span
            ><span class="letter" style='--letter-index: 2; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 3; --letter: "n";'
              >n</span
            ><span class="letter" style='--letter-index: 4; --letter: "n";'
              >n</span
            ><span class="letter" style='--letter-index: 5; --letter: "e";'
              >e</span
            ><span class="letter" style='--letter-index: 6; --letter: "c";'
              >c</span
            ><span class="letter" style='--letter-index: 7; --letter: "t";'
              >t</span
            ><span class="letter" style='--letter-index: 8; --letter: "i";'
              >i</span
            ><span class="letter" style='--letter-index: 9; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 10; --letter: "n";'
              >n</span
            ><span class="letter"> </span></span
          ><span class="word"
            ><span class="letter" style='--letter-index: 11; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 12; --letter: "f";'
              >f</span
            ><span class="letter"> </span></span
          ><span class="word"
            ><span class="letter" style='--letter-index: 13; --letter: "S";'
              >S</span
            ><span class="letter" style='--letter-index: 14; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 15; --letter: "u";'
              >u</span
            ><span class="letter" style='--letter-index: 16; --letter: "l";'
              >l</span
            ><span class="letter" style='--letter-index: 17; --letter: "s";'
              >s</span
            ></span
          ></span
        >
      </div>
      <img
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6424735e8ad857e1795cd4d6_arrow.svg"
        loading="lazy"
        width="10"
        alt=""
      />
    </div>
  </div>
  <div
    id="w-node-_83134aa9-b338-2e57-210b-50cc323123cb-586c9c2f"
    class="theprocessforme"
  >
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642da8baa1f6ac90db8ee034_flower.png"
      loading="lazy"
      width="61"
      height="77"
      alt="A cute drawn flower"
      class="image-8"
    />
    <p class="paragraph-text textaligncenter">
      The process for me is always like we dance feeling each other and that
      time comes something unique for you and for me.
    </p>
    <div class="backgroundcircle"></div>
  </div>
  <div
    id="w-node-a68ff6f1-9bf2-86ae-b18b-f97d68ca64eb-586c9c2f"
    class="photowrapper transition"
  >
    <img
      animation-images="true"
      class="image-39"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64256612ce1dfb2fe0d6021e_t12.webp"
      alt="A picture of an ornamental and floral art made by Lass Tattoo"
      sizes="93vw"
      id="w-node-f72bf604-7468-44bf-f063-bf6db7866bd7-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64256612ce1dfb2fe0d6021e_t12-p-500.webp   500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64256612ce1dfb2fe0d6021e_t12-p-800.webp   800w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64256612ce1dfb2fe0d6021e_t12-p-1080.webp 1080w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64256612ce1dfb2fe0d6021e_t12.webp        1322w
      "
    />
  </div>
  <div
    id="w-node-a9ae83e0-fe6b-0f26-ef92-0998dd646cd7-586c9c2f"
    class="storywrapper"
  >
    <div class="photowrapper transition">
      <img
        animation-images="true"
        class="image-36"
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d3d884eda5e09aa0794ed_Rectangle%2021.webp"
        alt="Floral tattoo by Lass tattoo artist from Hamburg"
        sizes="(max-width: 479px) 100vw, 93vw"
        id="w-node-c88a9aee-b001-9ca8-b4bb-b046d51eb496-586c9c2f"
        loading="lazy"
        srcset="
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d3d884eda5e09aa0794ed_Rectangle%2021-p-500.webp 500w,
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d3d884eda5e09aa0794ed_Rectangle%2021.webp       510w
        "
      />
    </div>
    <div
      data-delay="4000"
      data-animation="slide"
      class="mobilepicslider floral w-slider"
      data-autoplay="false"
      data-easing="ease"
      data-hide-arrows="false"
      data-disable-swipe="false"
      data-autoplay-limit="0"
      data-nav-spacing="3"
      data-duration="500"
      data-infinite="true"
      role="region"
      aria-label="carousel"
    >
      <div class="mask-2 w-slider-mask" id="w-slider-mask-3">
        <div
          class="slide w-slide"
          aria-label="1 of 2"
          role="group"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d3d884eda5e09aa0794ed_Rectangle%2021.webp"
            loading="lazy"
            sizes="(max-width: 479px) 93vw, 100vw"
            srcset="
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d3d884eda5e09aa0794ed_Rectangle%2021-p-500.webp 500w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d3d884eda5e09aa0794ed_Rectangle%2021.webp       510w
            "
            alt="Floral tattoo by Lass tattoo artist from Hamburg"
            class="mobilesliderpic"
          />
        </div>
        <div
          class="w-slide"
          aria-label="2 of 2"
          role="group"
          aria-hidden="true"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566124c408989307b7a65_t6.webp"
            loading="lazy"
            sizes="(max-width: 479px) 93vw, 100vw"
            srcset="
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566124c408989307b7a65_t6-p-500.webp 500w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566124c408989307b7a65_t6.webp       510w
            "
            alt="Floral tattoo by Lass tattoo artist from Hamburg"
            class="mobilesliderpic"
            aria-hidden="true"
          />
        </div>
        <div
          aria-live="off"
          aria-atomic="true"
          class="w-slider-aria-label"
          data-wf-ignore=""
        ></div>
      </div>
      <div
        class="mobilesliderarrow w-slider-arrow-left"
        role="button"
        tabindex="0"
        aria-controls="w-slider-mask-3"
        aria-label="previous slide"
      >
        <div class="w-icon-slider-left"></div>
      </div>
      <div
        class="mobilesliderarrow w-slider-arrow-right"
        role="button"
        tabindex="0"
        aria-controls="w-slider-mask-3"
        aria-label="next slide"
      >
        <div class="w-icon-slider-right"></div>
      </div>
      <div class="w-slider-nav w-round">
        <div
          class="w-slider-dot w-active"
          data-wf-ignore=""
          aria-label="Show slide 1 of 2"
          aria-pressed="true"
          role="button"
          tabindex="0"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
        <div
          class="w-slider-dot"
          data-wf-ignore=""
          aria-label="Show slide 2 of 2"
          aria-pressed="false"
          role="button"
          tabindex="-1"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
      </div>
    </div>
    <div
      animation-flip-trigger=""
      data-openspopup="anais"
      class="picturecaption"
    >
      <div animation-flip="" class="main-text show-by-letter shown">
        <span class="line"
          ><span class="word"
            ><span class="letter" style='--letter-index: 0; --letter: "T";'
              >T</span
            ><span class="letter" style='--letter-index: 1; --letter: "h";'
              >h</span
            ><span class="letter" style='--letter-index: 2; --letter: "e";'
              >e</span
            ><span class="letter"> </span></span
          ><span class="word"
            ><span class="letter" style='--letter-index: 3; --letter: "F";'
              >F</span
            ><span class="letter" style='--letter-index: 4; --letter: "e";'
              >e</span
            ><span class="letter" style='--letter-index: 5; --letter: "m";'
              >m</span
            ><span class="letter" style='--letter-index: 6; --letter: "i";'
              >i</span
            ><span class="letter" style='--letter-index: 7; --letter: "n";'
              >n</span
            ><span class="letter" style='--letter-index: 8; --letter: "i";'
              >i</span
            ><span class="letter" style='--letter-index: 9; --letter: "n";'
              >n</span
            ><span class="letter" style='--letter-index: 10; --letter: "e";'
              >e</span
            ><span class="letter"> </span></span
          ><span class="word"
            ><span class="letter" style='--letter-index: 11; --letter: "P";'
              >P</span
            ><span class="letter" style='--letter-index: 12; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 13; --letter: "w";'
              >w</span
            ><span class="letter" style='--letter-index: 14; --letter: "e";'
              >e</span
            ><span class="letter" style='--letter-index: 15; --letter: "r";'
              >r</span
            ></span
          ></span
        >
      </div>
      <img
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6424735e8ad857e1795cd4d6_arrow.svg"
        loading="lazy"
        width="10"
        alt=""
      />
    </div>
  </div>
  <div
    id="w-node-_514ae9b5-8700-79a3-b225-402eae4fdb48-586c9c2f"
    class="storywrapper"
  >
    <div class="photowrapper transition">
      <img
        animation-images="true"
        class="image-38"
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566120aee523b7c6ea139_t14.webp"
        alt="A beautiful ornamental tattoo on arm made by Lass tattoo artist based in Hamburg"
        sizes="(max-width: 479px) 100vw, 93vw"
        id="w-node-d4ad68ed-a98d-a28b-d656-2e8b768f65b1-586c9c2f"
        loading="lazy"
        srcset="
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566120aee523b7c6ea139_t14-p-500.webp 500w,
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566120aee523b7c6ea139_t14.webp       508w
        "
      />
    </div>
    <div
      data-delay="4000"
      data-animation="slide"
      class="mobilepicslider ornamental w-slider"
      data-autoplay="false"
      data-easing="ease"
      data-hide-arrows="false"
      data-disable-swipe="false"
      data-autoplay-limit="0"
      data-nav-spacing="3"
      data-duration="500"
      data-infinite="true"
      role="region"
      aria-label="carousel"
    >
      <div class="mask-2 w-slider-mask" id="w-slider-mask-4">
        <div
          class="slide w-slide"
          aria-label="1 of 2"
          role="group"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566120aee523b7c6ea139_t14.webp"
            loading="lazy"
            sizes="(max-width: 479px) 93vw, 100vw"
            srcset="
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566120aee523b7c6ea139_t14-p-500.webp 500w,
              https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566120aee523b7c6ea139_t14.webp       508w
            "
            alt="A beautiful ornamental tattoo on arm made by Lass tattoo artist based in Hamburg"
            class="mobilesliderpic"
          />
        </div>
        <div
          class="w-slide"
          aria-label="2 of 2"
          role="group"
          aria-hidden="true"
          style="transition: all; transform: translateX(0px); opacity: 1;"
        >
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64302d0241abf1f424fd0a9c_ornamental.webp"
            loading="lazy"
            alt="A beautiful ornamental tattoo on arm made by Lass tattoo artist based in Hamburg"
            class="mobilesliderpic"
            aria-hidden="true"
          />
        </div>
        <div
          aria-live="off"
          aria-atomic="true"
          class="w-slider-aria-label"
          data-wf-ignore=""
        ></div>
      </div>
      <div
        class="mobilesliderarrow w-slider-arrow-left"
        role="button"
        tabindex="0"
        aria-controls="w-slider-mask-4"
        aria-label="previous slide"
      >
        <div class="w-icon-slider-left"></div>
      </div>
      <div
        class="mobilesliderarrow w-slider-arrow-right"
        role="button"
        tabindex="0"
        aria-controls="w-slider-mask-4"
        aria-label="next slide"
      >
        <div class="w-icon-slider-right"></div>
      </div>
      <div class="w-slider-nav w-round">
        <div
          class="w-slider-dot w-active"
          data-wf-ignore=""
          aria-label="Show slide 1 of 2"
          aria-pressed="true"
          role="button"
          tabindex="0"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
        <div
          class="w-slider-dot"
          data-wf-ignore=""
          aria-label="Show slide 2 of 2"
          aria-pressed="false"
          role="button"
          tabindex="-1"
          style="margin-left: 3px; margin-right: 3px;"
        ></div>
      </div>
    </div>
    <div
      animation-flip-trigger=""
      data-openspopup="sara"
      class="picturecaption"
    >
      <div animation-flip="" class="main-text show-by-letter shown">
        <span class="line"
          ><span class="word"
            ><span class="letter" style='--letter-index: 0; --letter: "S";'
              >S</span
            ><span class="letter" style='--letter-index: 1; --letter: "u";'
              >u</span
            ><span class="letter" style='--letter-index: 2; --letter: "n";'
              >n</span
            ><span class="letter" style='--letter-index: 3; --letter: "s";'
              >s</span
            ><span class="letter" style='--letter-index: 4; --letter: "h";'
              >h</span
            ><span class="letter" style='--letter-index: 5; --letter: "i";'
              >i</span
            ><span class="letter" style='--letter-index: 6; --letter: "n";'
              >n</span
            ><span class="letter" style='--letter-index: 7; --letter: "e";'
              >e</span
            ><span class="letter"> </span></span
          ><span class="word"
            ><span class="letter" style='--letter-index: 8; --letter: "i";'
              >i</span
            ><span class="letter" style='--letter-index: 9; --letter: "n";'
              >n</span
            ><span class="letter"> </span></span
          ><span class="word"
            ><span class="letter" style='--letter-index: 10; --letter: "B";'
              >B</span
            ><span class="letter" style='--letter-index: 11; --letter: "l";'
              >l</span
            ><span class="letter" style='--letter-index: 12; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 13; --letter: "o";'
              >o</span
            ><span class="letter" style='--letter-index: 14; --letter: "m";'
              >m</span
            ></span
          ></span
        >
      </div>
      <img
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6424735e8ad857e1795cd4d6_arrow.svg"
        loading="lazy"
        width="10"
        alt=""
      />
    </div>
  </div>
  <div
    id="w-node-_0d3776ee-d82f-a7f7-0167-5ecae9960da6-586c9c2f"
    class="photowrapper transition"
  >
    <img
      animation-images="true"
      class="image-40"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661253ab1498d089baa0_t15.webp"
      alt="A picture of ornamental floral tattoo by Lass Tattoo"
      sizes="93vw"
      id="w-node-c04b149e-74e3-c417-d844-9c11e82c50a0-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661253ab1498d089baa0_t15-p-500.webp   500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661253ab1498d089baa0_t15-p-800.webp   800w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661253ab1498d089baa0_t15-p-1080.webp 1080w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425661253ab1498d089baa0_t15.webp        1322w
      "
    />
  </div>
  <div
    id="w-node-_91a15b66-8a9b-9965-18fd-ad59cf9fb1f3-586c9c2f"
    class="photowrapper disableonmobile transition"
  >
    <img
      animation-images="true"
      class="image-37"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64281947bb87cbffcc241a3b_t22.webp"
      alt="A beautiful tattoo art with flowers on hips made by Lass Tattoo artist from Hamburg"
      sizes="(max-width: 479px) 100vw, 93vw"
      id="w-node-_28036d85-86f3-3ef2-bdb6-6c795a339f7d-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64281947bb87cbffcc241a3b_t22-p-500.webp   500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64281947bb87cbffcc241a3b_t22-p-800.webp   800w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64281947bb87cbffcc241a3b_t22-p-1080.webp 1080w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64281947bb87cbffcc241a3b_t22.webp        1322w
      "
    />
  </div>
  <div
    data-delay="4000"
    data-animation="slide"
    class="mobilepicslider seashell w-slider"
    data-autoplay="false"
    data-easing="ease"
    data-hide-arrows="false"
    data-disable-swipe="false"
    data-autoplay-limit="0"
    data-nav-spacing="3"
    data-duration="500"
    data-infinite="true"
    id="w-node-fc06493b-2cbc-7871-f897-54197afe9383-586c9c2f"
    role="region"
    aria-label="carousel"
  >
    <div class="mask-2 w-slider-mask" id="w-slider-mask-5">
      <div
        class="slide w-slide"
        aria-label="1 of 2"
        role="group"
        style="transition: all; transform: translateX(0px); opacity: 1;"
      >
        <img
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64281947bb87cbffcc241a3b_t22.webp"
          loading="lazy"
          sizes="(max-width: 479px) 65vw, 100vw"
          srcset="
            https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64281947bb87cbffcc241a3b_t22-p-500.webp   500w,
            https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64281947bb87cbffcc241a3b_t22-p-800.webp   800w,
            https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64281947bb87cbffcc241a3b_t22-p-1080.webp 1080w,
            https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64281947bb87cbffcc241a3b_t22.webp        1322w
          "
          alt="A beautiful tattoo art with flowers on hips made by Lass Tattoo artist from Hamburg"
          class="mobilesliderpic"
        />
      </div>
      <div
        class="w-slide"
        aria-label="2 of 2"
        role="group"
        aria-hidden="true"
        style="transition: all; transform: translateX(0px); opacity: 1;"
      >
        <img
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6434140a4378238348beab4f_Rectangle%2034.webp"
          loading="lazy"
          alt="Floral tattoo by Lass tattoo artist from Hamburg"
          class="mobilesliderpic"
          aria-hidden="true"
        />
      </div>
      <div
        aria-live="off"
        aria-atomic="true"
        class="w-slider-aria-label"
        data-wf-ignore=""
      ></div>
    </div>
    <div
      class="mobilesliderarrow w-slider-arrow-left"
      role="button"
      tabindex="0"
      aria-controls="w-slider-mask-5"
      aria-label="previous slide"
    >
      <div class="w-icon-slider-left"></div>
    </div>
    <div
      class="mobilesliderarrow w-slider-arrow-right"
      role="button"
      tabindex="0"
      aria-controls="w-slider-mask-5"
      aria-label="next slide"
    >
      <div class="w-icon-slider-right"></div>
    </div>
    <div class="w-slider-nav w-round">
      <div
        class="w-slider-dot w-active"
        data-wf-ignore=""
        aria-label="Show slide 1 of 2"
        aria-pressed="true"
        role="button"
        tabindex="0"
        style="margin-left: 3px; margin-right: 3px;"
      ></div>
      <div
        class="w-slider-dot"
        data-wf-ignore=""
        aria-label="Show slide 2 of 2"
        aria-pressed="false"
        role="button"
        tabindex="-1"
        style="margin-left: 3px; margin-right: 3px;"
      ></div>
    </div>
  </div>
  <div
    id="w-node-_09672f99-ab9a-49cd-e939-7dc5c3cf4eb9-586c9c2f"
    class="photowrapper hiddenontabletandmobile transition"
  >
    <img
      animation-images="true"
      class="image-26"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566124c408989307b7a65_t6.webp"
      alt="Floral tattoo by Lass tattoo artist from Hamburg"
      sizes="(max-width: 991px) 100vw, 93vw"
      id="w-node-_1cfeb0cb-8dff-eedc-2e3c-a030f56472c4-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566124c408989307b7a65_t6-p-500.webp 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642566124c408989307b7a65_t6.webp       510w
      "
    />
  </div>
</div>
<div id="approach" class="w-layout-grid gridblock myprinciples">
  <div
    id="w-node-_8ed65b39-bcc0-cd49-afb4-cdaf122ae96e-586c9c2f"
    class="blocktopline"
  ></div>
  <h2
    id="w-node-_6af47c0d-4188-3804-74d0-6b9ad5547ce4-586c9c2f"
    class="blocktitle rightbutlefter"
  >
    my approach
  </h2>
  <div
    id="w-node-ed79bd06-9110-b290-a5df-7e76270fc2bd-586c9c2f"
    class="div-block-6"
  >
    <div
      data-poster-url="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d42176e06ee6cdcc3b9eb_Save-poster-00001.jpg"
      data-video-urls="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d42176e06ee6cdcc3b9eb_Save-transcode.mp4,https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d42176e06ee6cdcc3b9eb_Save-transcode.webm"
      data-autoplay="true"
      data-loop="true"
      data-wf-ignore="true"
      id="w-node-_73664b66-c7c2-04fa-316d-ffee9b6e55af-586c9c2f"
      class="background-video-2 w-background-video w-background-video-atom"
    >
      <video
        id="73664b66-c7c2-04fa-316d-ffee9b6e55af-video"
        autoplay=""
        loop=""
        style='background-image:url("https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d42176e06ee6cdcc3b9eb_Save-poster-00001.jpg")'
        muted=""
        playsinline=""
        data-wf-ignore="true"
        data-object-fit="cover"
      >
        <source
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d42176e06ee6cdcc3b9eb_Save-transcode.mp4"
          data-wf-ignore="true"
        />
        <source
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d42176e06ee6cdcc3b9eb_Save-transcode.webm"
          data-wf-ignore="true"
        />
      </video>
    </div>
  </div>
  <div
    id="w-node-_88daf49c-251f-29b0-186f-b3ce81d6c37a-586c9c2f"
    class="careandattention"
  >
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64257ada432e055364b0cb45_Care%20and.svg"
      loading="lazy"
      id="w-node-_35fc579f-b2b1-3c1b-4b09-9cc639f96926-586c9c2f"
      alt=""
      class="image-11"
    /><img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64257ada53ab14576d8ae3f4_attention%20for%20you.svg"
      loading="lazy"
      id="w-node-c5689ddb-4beb-8c6c-2559-2fe803137a75-586c9c2f"
      alt=""
      class="image-10"
    />
  </div>
  <img
    src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6425a5d7c2c9ce09958b9ddc_flower2.png"
    loading="lazy"
    width="297"
    height="260"
    alt="A beautiful flower"
    data-w-id="390d6fc7-3bc5-9be2-59d3-b7a30c41f6df"
    style="opacity: 1;"
    class="careflower"
  />
  <div
    id="w-node-c2a952bf-ba01-c879-1d7a-ded5597afd3c-586c9c2f"
    class="principles"
  >
    <div
      id="w-node-_2a6c67e6-0e31-0f51-ebf7-423e4c726048-586c9c2f"
      class="principle"
    >
      <h3 class="paragraph-text principletitle">trust</h3>
      <p class="main-text principletextleft">
        Trust to the artist starts with trust in&nbsp;the&nbsp;world. My aim is
        to inspire faith in&nbsp;yourself, the future, and life itself through
        tattoos.
      </p>
    </div>
    <div
      id="w-node-_0cfc251a-8de1-3d8c-9151-e95c3413f605-586c9c2f"
      class="principle"
    >
      <h3 class="paragraph-text principletitle">Freedom</h3>
      <p class="main-text principletextright">
        I want to deliver a message through my&nbsp;art&nbsp;that you are free
        and free always and everywhere. The choice is&nbsp;always yours.
      </p>
    </div>
  </div>
  <div class="blockbottomline"></div>
</div>
<div id="reviews" class="w-layout-grid gridblock reviews">
  <div
    id="w-node-_4bbd9a29-7d7d-9c4e-10ad-be12c7f52a8e-586c9c2f"
    class="blocktopline"
  ></div>
  <h2
    id="w-node-bce2aa72-2ada-35c1-83c0-bcf809fbf9de-586c9c2f"
    class="blocktitle right reviews"
  >
    reviews
  </h2>
  <div
    id="w-node-_3b217d87-3e0f-d620-a2f4-37e1cdd386c4-586c9c2f"
    class="yourpreciousemotionstitle"
  >
    <div class="sticking">
      <p
        animation-letters="true"
        id="w-node-dd942604-5046-ce68-b386-44e562657236-586c9c2f"
        class="heading-2 desktop show-by-letter transition shown"
        style="--anim-time: 0.8s;"
      >
        <span class="line"
          ><span class="word"
            ><span class="letter" style="--letter-index: 0;">y</span
            ><span class="letter" style="--letter-index: 1;">o</span
            ><span class="letter" style="--letter-index: 2;">u</span
            ><span class="letter" style="--letter-index: 3;">r</span></span
          ></span
        >
      </p>
      <p
        animation-letters="true"
        class="heading-2 desktop show-by-letter transition shown"
        style="--anim-time: 0.8s;"
      >
        <span class="line"
          ><span class="word"
            ><span class="letter" style="--letter-index: 0;">p</span
            ><span class="letter" style="--letter-index: 1;">r</span
            ><span class="letter" style="--letter-index: 2;">e</span
            ><span class="letter" style="--letter-index: 3;">c</span
            ><span class="letter" style="--letter-index: 4;">i</span
            ><span class="letter" style="--letter-index: 5;">o</span
            ><span class="letter" style="--letter-index: 6;">u</span
            ><span class="letter" style="--letter-index: 7;">s</span></span
          ></span
        >
      </p>
      <p
        animation-letters=""
        class="heading-2 yourmobile show-by-letter"
        style="--anim-time: 0.8s;"
      >
        <span class="line"
          ><span class="word"
            ><span class="letter" style="--letter-index: 0;">y</span
            ><span class="letter" style="--letter-index: 1;">o</span
            ><span class="letter" style="--letter-index: 2;">u</span
            ><span class="letter" style="--letter-index: 3;">r</span></span
          ></span
        >
      </p>
      <p
        animation-letters=""
        class="heading-2 preciousmobile show-by-letter"
        style="--anim-time: 0.8s;"
      >
        <span class="line"
          ><span class="word"
            ><span class="letter" style="--letter-index: 0;">p</span
            ><span class="letter" style="--letter-index: 1;">r</span
            ><span class="letter" style="--letter-index: 2;">e</span
            ><span class="letter" style="--letter-index: 3;">c</span
            ><span class="letter" style="--letter-index: 4;">i</span
            ><span class="letter" style="--letter-index: 5;">-</span></span
          ></span
        ><br /><span class="line"
          ><span class="word"
            ><span class="letter" style="--letter-index: 6;">o</span
            ><span class="letter" style="--letter-index: 7;">u</span
            ><span class="letter" style="--letter-index: 8;">s</span></span
          ></span
        >
      </p>
      <img
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642b0c9b4ab50f4018d15195_emotions.svg"
        loading="lazy"
        id="w-node-_6a8bfdad-f98c-fefd-f3b7-6c19b0674882-586c9c2f"
        alt="emotions"
        class="image-20"
      />
    </div>
  </div>
  <div
    id="w-node-f4dcf26f-0194-c9ce-ccdd-0d537702bb1b-586c9c2f"
    class="reviewscolumn left stickytopfix"
  >
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e695bf491d970e6947_Rev1.webp"
      loading="lazy"
      sizes="(max-width: 479px) 62vw, 93vw"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e695bf491d970e6947_Rev1-p-500.webp 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e695bf491d970e6947_Rev1.webp       780w
      "
      alt="Review for a tattoo artist Lass"
      class="reviewright feedback1"
    /><img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e6c3ed64aaffdef765_rev3.webp"
      loading="lazy"
      sizes="(max-width: 479px) 62vw, 93vw"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e6c3ed64aaffdef765_rev3-p-500.webp 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e6c3ed64aaffdef765_rev3.webp       780w
      "
      alt="A happy review for Lass tattoo artist from Daniella"
      class="reviewleft feedback2"
    /><img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e5192bc3aab5d59668_rev4.webp"
      loading="lazy"
      sizes="(max-width: 479px) 62vw, 93vw"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e5192bc3aab5d59668_rev4-p-500.webp 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e5192bc3aab5d59668_rev4.webp       780w
      "
      alt="A review for tattoo artist Lass"
      class="reviewright feedback3"
    />
    <div class="emoreviewright feedback4">
      <div
        data-poster-url="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d4a7b75d75be6616a1f20_ReviewVid1-poster-00001.jpg"
        data-video-urls="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d4a7b75d75be6616a1f20_ReviewVid1-transcode.mp4,https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d4a7b75d75be6616a1f20_ReviewVid1-transcode.webm"
        data-autoplay="true"
        data-loop="true"
        data-wf-ignore="true"
        class="background-video-4 w-background-video w-background-video-atom"
      >
        <video
          id="80757bee-6c26-9a7f-dc13-a6d3ef076429-video"
          autoplay=""
          loop=""
          style='background-image:url("https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d4a7b75d75be6616a1f20_ReviewVid1-poster-00001.jpg")'
          muted=""
          playsinline=""
          data-wf-ignore="true"
          data-object-fit="cover"
        >
          <source
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d4a7b75d75be6616a1f20_ReviewVid1-transcode.mp4"
            data-wf-ignore="true"
          />
          <source
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d4a7b75d75be6616a1f20_ReviewVid1-transcode.webm"
            data-wf-ignore="true"
          />
        </video>
      </div>
    </div>
  </div>
  <div
    id="w-node-_94235459-dd1d-bc3d-a985-8eb1ac64ed47-586c9c2f"
    class="reviewscolumn right stickytopfix"
  >
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e5f04d822b4bcbf48b_rev2.webp"
      loading="lazy"
      sizes="(max-width: 479px) 62vw, 93vw"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e5f04d822b4bcbf48b_rev2-p-500.webp 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e5f04d822b4bcbf48b_rev2.webp       780w
      "
      alt="Happy review on tattoo artist work"
      class="reviewleft feedback5"
    />
    <div class="emoreviewleft feedback6">
      <div
        data-poster-url="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d44227dc4407d39344595_ReviewVid2-poster-00001.jpg"
        data-video-urls="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d44227dc4407d39344595_ReviewVid2-transcode.mp4,https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d44227dc4407d39344595_ReviewVid2-transcode.webm"
        data-autoplay="true"
        data-loop="true"
        data-wf-ignore="true"
        class="background-video-3 w-background-video w-background-video-atom"
      >
        <video
          id="bfdadfa3-13c9-6603-de9d-ae1c2a2b49e9-video"
          autoplay=""
          loop=""
          style='background-image:url("https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d44227dc4407d39344595_ReviewVid2-poster-00001.jpg")'
          muted=""
          playsinline=""
          data-wf-ignore="true"
          data-object-fit="cover"
        >
          <source
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d44227dc4407d39344595_ReviewVid2-transcode.mp4"
            data-wf-ignore="true"
          />
          <source
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642d44227dc4407d39344595_ReviewVid2-transcode.webm"
            data-wf-ignore="true"
          />
        </video>
      </div>
    </div>
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642f0f276ca080572e8bb520_revlost.png"
      loading="lazy"
      sizes="(max-width: 479px) 62vw, 93vw"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642f0f276ca080572e8bb520_revlost-p-500.png 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642f0f276ca080572e8bb520_revlost.png       780w
      "
      alt="A happy review on tattoo art"
      class="reviewright feedback7"
    /><img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e61624b42232d9be26_rev6.webp"
      loading="lazy"
      sizes="(max-width: 479px) 62vw, 93vw"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e61624b42232d9be26_rev6-p-500.webp 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6426a5e61624b42232d9be26_rev6.webp       780w
      "
      alt="A happy review from Sandra on tattoo art"
      class="reviewleft feedback8"
    />
  </div>
</div>
<div
  id="pre-care"
  class="w-layout-grid gridblock beforethesession w-node-_6f37341b-c4f9-9b4d-d41b-ae6a167f60bf-586c9c2f"
>
  <div
    id="w-node-_323e7f65-ffae-b1a6-07e7-f83614d984bd-586c9c2f"
    class="blocktopline"
  ></div>
  <h2
    id="w-node-_372e4297-a1b3-a1fa-811e-bd0b58d87bc2-586c9c2f"
    class="blocktitle left"
  >
    before the session
  </h2>
  <div
    id="w-node-_18c38c70-12ad-2a0b-606e-24e918f271fc-586c9c2f"
    class="takecareofyourself"
  >
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642b1025155bfa21e0c59552_Take%20care%20of%20yourself.svg"
      loading="lazy"
      id="w-node-_8560082c-bf6c-f583-463a-226c06536edc-586c9c2f"
      alt="Take care of yourself"
      class="takecaredesktop"
    /><img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64314c599d91c6e7c2b6066d_Take%20care.svg"
      loading="lazy"
      alt="Take care"
      class="takecaremobile"
    /><img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64314c7388264b801558b3c7_of%20yourself.svg"
      loading="lazy"
      alt="of yourself"
      class="ofyourselfmobile"
    />
  </div>
  <div
    data-delay="4000"
    data-animation="slide"
    class="slider w-slider"
    data-autoplay="false"
    data-easing="ease"
    data-hide-arrows="true"
    data-disable-swipe="false"
    data-autoplay-limit="0"
    data-nav-spacing="3"
    data-duration="500"
    data-infinite="false"
    id="w-node-_2fe684f8-56e9-0a4c-ad2c-f7b21d3310ea-586c9c2f"
    role="region"
    aria-label="carousel"
  >
    <div class="mask w-slider-mask" id="w-slider-mask-6">
      <div
        class="takecareslide prepareskin w-slide"
        aria-label="1 of 9"
        role="group"
        style="transition: all; transform: translateX(0px); opacity: 1;"
      >
        <div class="takecareslidecontent">
          <div class="takecareslidecontenttop">
            <h3 class="boldtitle">Prepare<br />your skin</h3>
          </div>
          <p class="main-text">
            Please moisturize your skin as often as&nbsp;you can (best for 3
            days before the&nbsp;session). Use coconut oil/butter, it&nbsp;will
            make your skin more soft and&nbsp;gentle which means it will be
            a&nbsp;pleasure to tattoo that skin and the&nbsp;result will be
            perfect!
          </p>
        </div>
      </div>
      <div
        class="takecareslide nowax w-slide"
        aria-label="2 of 9"
        role="group"
        aria-hidden="true"
        style="transition: all; transform: translateX(0px); opacity: 1;"
      >
        <div class="takecareslidecontent" aria-hidden="true">
          <div class="takecareslidecontenttop" aria-hidden="true">
            <h3 class="boldtitle" aria-hidden="true">
              DO NOT wax your tattoo placement
            </h3>
          </div>
          <p class="main-text" aria-hidden="true">
            But you could shave the placement on&nbsp;your skin - 1 day before
            session.
          </p>
        </div>
      </div>
      <div
        class="takecareslide picture w-slide"
        aria-label="3 of 9"
        role="group"
        aria-hidden="true"
        style="transition: all; transform: translateX(0px); opacity: 1;"
      >
        <div class="takecareslidecontent picture" aria-hidden="true">
          <div
            id="w-node-_85f5bafe-d42b-cdac-2dad-386cf461dcce-586c9c2f"
            class="photowrapper takecare"
            aria-hidden="true"
          >
            <img
              src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643968fd28a94b792cb74aae_takecare.webp"
              loading="lazy"
              id="w-node-_5dfd6bd6-f8ca-61b0-eb69-d99e85b5aac0-586c9c2f"
              alt="Beautiful leaf tattoo"
              class="image-22"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div
        class="takecareslide eatwell w-slide"
        aria-label="4 of 9"
        role="group"
        aria-hidden="true"
        style="transition: all; transform: translateX(0px); opacity: 1;"
      >
        <div class="takecareslidecontent" aria-hidden="true">
          <div class="takecareslidecontenttop" aria-hidden="true">
            <h3 class="boldtitle" aria-hidden="true">
              Eat super well before the session
            </h3>
          </div>
          <p class="main-text" aria-hidden="true">
            At least 1 hour before. And please, also&nbsp;take with you some
            snacks, chocolates and water, it’s very important!
          </p>
        </div>
      </div>
      <div
        class="takecareslide wearcorrectclothes w-slide"
        aria-label="5 of 9"
        role="group"
        aria-hidden="true"
        style="transition: all; transform: translateX(0px); opacity: 1;"
      >
        <div class="takecareslidecontent" aria-hidden="true">
          <div class="takecareslidecontenttop" aria-hidden="true">
            <h3 class="boldtitle" aria-hidden="true">Wear correct clothes</h3>
          </div>
          <p class="main-text" aria-hidden="true">
            Especially if the area for your tattoo is&nbsp;under Your breast, on
            your ribs, etc. You have to be prepared for the&nbsp;moment where
            you need to take&nbsp;your clothes off and put some special stickers
            for your nipples, which means it is going to be comfortable for you
            and me as well.
          </p>
        </div>
      </div>
      <div
        class="takecareslide tightclothesmobile w-slide"
        aria-label="6 of 9"
        role="group"
        aria-hidden="true"
        style="transition: all; transform: translateX(0px); opacity: 1;"
      >
        <div
          class="takecareslidecontent tightclothesmobilecontent"
          aria-hidden="true"
        >
          <div class="takecareslidecontenttop" aria-hidden="true">
            <h3 class="boldtitle" aria-hidden="true">
              do not <br aria-hidden="true" />wear tight underwear and clothes
            </h3>
          </div>
          <p class="main-text" aria-hidden="true">
            So that there are no traces left at&nbsp;the&nbsp;place where we
            will do the tattoo. It&nbsp;will be more comfortable for both
            of&nbsp;us to work if you come in&nbsp;loose and&nbsp;soft
            underwear/clothes.
          </p>
        </div>
      </div>
      <div
        class="takecareslide noalcoholmobile w-slide"
        aria-label="7 of 9"
        role="group"
        aria-hidden="true"
        style="transition: all; transform: translateX(0px); opacity: 1;"
      >
        <div
          class="takecareslidecontent noalcoholmobilecontent"
          aria-hidden="true"
        >
          <div class="takecareslidecontenttop" aria-hidden="true">
            <h3 class="boldtitle" aria-hidden="true">DO NOT drink alcohol</h3>
          </div>
          <p class="main-text" aria-hidden="true">
            At least 1 day before session (and&nbsp;after session as well). For
            me it’s very&nbsp;important that your body is&nbsp;not intoxicated
            and you feel fresh&nbsp;and well.
          </p>
        </div>
      </div>
      <div
        class="takecareslide nosunmobile w-slide"
        aria-label="8 of 9"
        role="group"
        aria-hidden="true"
        style="transition: all; transform: translateX(0px); opacity: 1;"
      >
        <div class="takecareslidecontent nosunmobile" aria-hidden="true">
          <div class="takecareslidecontenttop" aria-hidden="true">
            <h3 class="boldtitle" aria-hidden="true">
              Try not to spend a lot of time in the&nbsp;sun
            </h3>
          </div>
          <p class="main-text" aria-hidden="true">
            Before our session, please don’t get&nbsp;a&nbsp;sunburn, because
            your skin can be irritated and it’s really hard to work on irritated
            and dry skin.
          </p>
        </div>
      </div>
      <div
        class="takecareslide wide w-slide"
        aria-label="9 of 9"
        role="group"
        aria-hidden="true"
        style="transition: all; transform: translateX(0px); opacity: 1;"
      >
        <div class="takecareslideinnerwrapper" aria-hidden="true">
          <div
            class="takecareslide inner tightclothesdesktop"
            aria-hidden="true"
          >
            <div class="takecareslidecontent" aria-hidden="true">
              <div class="takecareslidecontenttop" aria-hidden="true">
                <h3 class="boldtitle" aria-hidden="true">
                  do not <br aria-hidden="true" />wear tight underwear and
                  clothes
                </h3>
              </div>
              <p class="main-text" aria-hidden="true">
                So that there are no traces left at&nbsp;the&nbsp;place where we
                will do the tattoo. It&nbsp;will be more comfortable for both
                of&nbsp;us to work if you come in&nbsp;loose and&nbsp;soft
                underwear/clothes.
              </p>
            </div>
          </div>
          <div class="takecareslide inner noalcoholdesktop" aria-hidden="true">
            <div class="takecareslidecontent noalcohol" aria-hidden="true">
              <div class="takecareslidecontenttop" aria-hidden="true">
                <h3 class="boldtitle" aria-hidden="true">
                  DO NOT drink alcohol
                </h3>
              </div>
              <p class="main-text" aria-hidden="true">
                At least 1 day before session (and&nbsp;after session as well).
                For me it’s very&nbsp;important that your body is&nbsp;not
                intoxicated and you feel fresh&nbsp;and well.
              </p>
            </div>
          </div>
          <div class="takecareslide inner nosundesktop" aria-hidden="true">
            <div class="takecareslidecontent nosundesktop" aria-hidden="true">
              <div class="takecareslidecontenttop" aria-hidden="true">
                <h3 class="boldtitle" aria-hidden="true">
                  Try not to spend a lot of time in the&nbsp;sun
                </h3>
              </div>
              <p class="main-text" aria-hidden="true">
                Before our session, please don’t get&nbsp;a&nbsp;sunburn,
                because your skin can be irritated and it’s really hard to work
                on irritated and dry skin.
              </p>
            </div>
          </div>
          <div class="takecareslide inner" aria-hidden="true">
            <div class="takecareslidecontent" aria-hidden="true">
              <div class="takecareslidecontenttop" aria-hidden="true">
                <h3 class="boldtitle" aria-hidden="true">
                  Don’t take painkillers at&nbsp;all
                </h3>
              </div>
              <p class="main-text" aria-hidden="true">
                And don’t be scared if it’s your first tattoo, it’s really not
                as painful as you can think and being scared is not going to
                help us to make the best quality and adorable tattoo.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-live="off"
        aria-atomic="true"
        class="w-slider-aria-label"
        data-wf-ignore=""
      ></div>
    </div>
    <div
      class="takecarearrowcontainer left w-slider-arrow-left"
      role="button"
      tabindex="0"
      aria-controls="w-slider-mask-6"
      aria-label="previous slide"
      style="display: none;"
    >
      <div class="takecareicon w-icon-slider-left"></div>
      <img
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64329b11b03b840484e9045a_%D0%B1.svg"
        loading="lazy"
        alt=""
        class="takecarearrow left"
      />
    </div>
    <div
      class="takecarearrowcontainer right w-slider-arrow-right"
      role="button"
      tabindex="0"
      aria-controls="w-slider-mask-6"
      aria-label="next slide"
    >
      <div class="takecareicon w-icon-slider-right"></div>
      <img
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64329b11b03b840484e9045a_%D0%B1.svg"
        loading="lazy"
        alt=""
        class="takecarearrow right"
      />
    </div>
    <div class="slide-nav w-slider-nav w-round w-num">
      <div
        class="w-slider-dot w-active"
        data-wf-ignore=""
        aria-label="Show slide 1 of 6"
        aria-pressed="true"
        role="button"
        tabindex="0"
        style="margin-left: 3px; margin-right: 3px;"
      >
        1
      </div>
      <div
        class="w-slider-dot"
        data-wf-ignore=""
        aria-label="Show slide 2 of 6"
        aria-pressed="false"
        role="button"
        tabindex="-1"
        style="margin-left: 3px; margin-right: 3px;"
      >
        2
      </div>
      <div
        class="w-slider-dot"
        data-wf-ignore=""
        aria-label="Show slide 3 of 6"
        aria-pressed="false"
        role="button"
        tabindex="-1"
        style="margin-left: 3px; margin-right: 3px;"
      >
        3
      </div>
      <div
        class="w-slider-dot"
        data-wf-ignore=""
        aria-label="Show slide 4 of 6"
        aria-pressed="false"
        role="button"
        tabindex="-1"
        style="margin-left: 3px; margin-right: 3px;"
      >
        4
      </div>
      <div
        class="w-slider-dot"
        data-wf-ignore=""
        aria-label="Show slide 5 of 6"
        aria-pressed="false"
        role="button"
        tabindex="-1"
        style="margin-left: 3px; margin-right: 3px;"
      >
        5
      </div>
      <div
        class="w-slider-dot"
        data-wf-ignore=""
        aria-label="Show slide 6 of 6"
        aria-pressed="false"
        role="button"
        tabindex="-1"
        style="margin-left: 3px; margin-right: 3px;"
      >
        6
      </div>
    </div>
  </div>
</div>
<div
  id="w-node-_248b9681-1e4f-587b-c7f0-750d8c4e2c7f-586c9c2f"
  class="w-layout-grid gridblock letsvibetogether"
>
  <div
    data-poster-url="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643289dc3030fd0893cd0621_Let'sVibe-poster-00001.jpg"
    data-video-urls="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643289dc3030fd0893cd0621_Let'sVibe-transcode.mp4,https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643289dc3030fd0893cd0621_Let'sVibe-transcode.webm"
    data-autoplay="true"
    data-loop="true"
    data-wf-ignore="true"
    data-w-id="5f09b935-4a5c-23de-9f29-3f2194c4f512"
    class="letsvibetogethervideo w-background-video w-background-video-atom"
    style="will-change: transform; transform: translate3d(0px, 26%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg); transform-style: preserve-3d;"
  >
    <video
      id="5f09b935-4a5c-23de-9f29-3f2194c4f512-video"
      autoplay=""
      loop=""
      style='background-image:url("https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643289dc3030fd0893cd0621_Let&apos;sVibe-poster-00001.jpg")'
      muted=""
      playsinline=""
      data-wf-ignore="true"
      data-object-fit="cover"
    >
      <source
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643289dc3030fd0893cd0621_Let'sVibe-transcode.mp4"
        data-wf-ignore="true"
      />
      <source
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643289dc3030fd0893cd0621_Let'sVibe-transcode.webm"
        data-wf-ignore="true"
      />
    </video>
  </div>
  <div
    id="w-node-_9b7c3055-b453-2ab9-9ba6-dee7aecf8553-586c9c2f"
    class="letsvibetext"
  >
    <p
      animation-letters="true"
      class="heading-2 grey letsvibedesktop show-by-letter transition shown"
      style="--anim-time: 0.8s;"
    >
      <span class="line"
        ><span class="word"
          ><span class="letter" style="--letter-index: 0;">l</span
          ><span class="letter" style="--letter-index: 1;">e</span
          ><span class="letter" style="--letter-index: 2;">t</span
          ><span class="letter" style="--letter-index: 3;">’</span
          ><span class="letter" style="--letter-index: 4;">s</span
          ><span class="letter"> </span></span
        ><span class="word"
          ><span class="letter" style="--letter-index: 5;">v</span
          ><span class="letter" style="--letter-index: 6;">i</span
          ><span class="letter" style="--letter-index: 7;">b</span
          ><span class="letter" style="--letter-index: 8;">e</span></span
        ></span
      >
    </p>
    <p
      animation-letters="true"
      class="heading-2 grey togetherdesktop show-by-letter transition shown"
      style="--anim-time: 0.8s;"
    >
      <span class="line"
        ><span class="word"
          ><span class="letter" style="--letter-index: 0;">t</span
          ><span class="letter" style="--letter-index: 1;">o</span
          ><span class="letter" style="--letter-index: 2;">g</span
          ><span class="letter" style="--letter-index: 3;">e</span
          ><span class="letter" style="--letter-index: 4;">t</span
          ><span class="letter" style="--letter-index: 5;">h</span
          ><span class="letter" style="--letter-index: 6;">e</span
          ><span class="letter" style="--letter-index: 7;">r</span></span
        ></span
      >
    </p>
    <p
      animation-letters=""
      class="heading-2 grey letsmobile show-by-letter"
      style="--anim-time: 0.8s;"
    >
      <span class="line"
        ><span class="word"
          ><span class="letter" style="--letter-index: 0;">l</span
          ><span class="letter" style="--letter-index: 1;">e</span
          ><span class="letter" style="--letter-index: 2;">t</span
          ><span class="letter" style="--letter-index: 3;">’</span
          ><span class="letter" style="--letter-index: 4;">s</span></span
        ></span
      >
    </p>
    <p
      animation-letters=""
      class="heading-2 grey vibemobile show-by-letter"
      style="--anim-time: 0.8s;"
    >
      <span class="line"
        ><span class="word"
          ><span class="letter" style="--letter-index: 0;">v</span
          ><span class="letter" style="--letter-index: 1;">i</span
          ><span class="letter" style="--letter-index: 2;">b</span
          ><span class="letter" style="--letter-index: 3;">e</span></span
        ></span
      >
    </p>
    <p
      animation-letters=""
      class="heading-2 grey togethermobile show-by-letter"
      style="--anim-time: 0.8s;"
    >
      <span class="line"
        ><span class="word"
          ><span class="letter" style="--letter-index: 0;">t</span
          ><span class="letter" style="--letter-index: 1;">o</span
          ><span class="letter" style="--letter-index: 2;">g</span
          ><span class="letter" style="--letter-index: 3;">e</span
          ><span class="letter" style="--letter-index: 4;">-</span></span
        ></span
      ><br /><span class="line"
        ><span class="word"
          ><span class="letter" style="--letter-index: 5;">t</span
          ><span class="letter" style="--letter-index: 6;">h</span
          ><span class="letter" style="--letter-index: 7;">e</span
          ><span class="letter" style="--letter-index: 8;">r</span></span
        ></span
      >
    </p>
  </div>
  <img
    class="butterfly"
    src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643864c99d1eab110ae20da7_babockha.png"
    alt="Hand drawn butterfly"
    style="opacity: 1;"
    sizes="(max-width: 479px) 100vw, (max-width: 767px) 69vw, (max-width: 991px) 56vw, 35vw"
    data-w-id="a055fd64-6acd-0837-5b1d-0f154e224c50"
    id="w-node-a055fd64-6acd-0837-5b1d-0f154e224c50-586c9c2f"
    loading="lazy"
    srcset="
      https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643864c99d1eab110ae20da7_babockha-p-500.png   500w,
      https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643864c99d1eab110ae20da7_babockha-p-800.png   800w,
      https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643864c99d1eab110ae20da7_babockha-p-1080.png 1080w,
      https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/643864c99d1eab110ae20da7_babockha.png        1138w
    "
  />
</div>
<div id="contact" class="w-layout-grid gridblock address">
  <div
    id="w-node-edc2d42b-169f-9f20-48e7-95503c4fe004-586c9c2f"
    class="blocktopline"
  ></div>
  <h2
    id="w-node-d841aa9a-0cc0-5db6-110d-2df6161a628c-586c9c2f"
    class="blocktitle left"
  >
    contact
  </h2>
  <p
    id="w-node-d841aa9a-0cc0-5db6-110d-2df6161a6293-586c9c2f"
    class="paragraph-text leftmaintext"
  >
    I work in a beautiful and comfortable studio in Hamburg and i also do guest
    spots in other cities
  </p>
  <div
    id="w-node-bec52a7a-b32b-3416-2146-c0f8733b63a3-586c9c2f"
    class="photowrapper hiddenonmobile transition"
  >
    <img
      animation-images="true"
      class="image-16"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b44fc40b329d9a1702a1_Rectangle%20739-2.jpg"
      width="Auto"
      alt="Picture of a tattoo studio in Hamburg Hood Seven"
      sizes="(max-width: 479px) 100vw, 93vw"
      id="w-node-bec52a7a-b32b-3416-2146-c0f8733b63a4-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b44fc40b329d9a1702a1_Rectangle%20739-2-p-500.jpg   500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b44fc40b329d9a1702a1_Rectangle%20739-2-p-800.jpg   800w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b44fc40b329d9a1702a1_Rectangle%20739-2-p-1080.jpg 1080w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b44fc40b329d9a1702a1_Rectangle%20739-2.jpg        1323w
      "
    />
  </div>
  <div
    id="w-node-d5fee603-879d-0f67-f318-0cd4b26bdb3e-586c9c2f"
    class="photoscroller"
  >
    <div
      id="w-node-e68f9103-2700-9892-c315-2b7e9f22d9d4-586c9c2f"
      class="photowrapper scrolling clipped"
    >
      <img
        animation-images="true"
        class="mobilescrollingphoto"
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b44fc40b329d9a1702a1_Rectangle%20739-2.jpg"
        alt="Picture of a tattoo studio in Hamburg Hood Seven"
        sizes="(max-width: 479px) 74vw, 100vw"
        id="w-node-fea9de65-06c8-c372-9649-3308d9ff542e-586c9c2f"
        loading="lazy"
        srcset="
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b44fc40b329d9a1702a1_Rectangle%20739-2-p-500.jpg   500w,
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b44fc40b329d9a1702a1_Rectangle%20739-2-p-800.jpg   800w,
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b44fc40b329d9a1702a1_Rectangle%20739-2-p-1080.jpg 1080w,
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b44fc40b329d9a1702a1_Rectangle%20739-2.jpg        1323w
        "
      />
    </div>
    <div class="photowrapper scrolling clipped">
      <img
        animation-images="true"
        class="mobilescrollingphoto"
        src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b4b641125b8f72f838a1_Rectangle%20749-2.jpg"
        alt="Picture of a tattoo studio in Hamburg Hood Seven"
        sizes="(max-width: 479px) 74vw, 100vw"
        id="w-node-eb912c28-dfff-d325-917b-99f876423c17-586c9c2f"
        loading="lazy"
        srcset="
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b4b641125b8f72f838a1_Rectangle%20749-2-p-500.jpg 500w,
          https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b4b641125b8f72f838a1_Rectangle%20749-2.jpg       781w
        "
      />
    </div>
  </div>
  <div class="photoscrollerstyle w-embed">
    <style>
      .photoscroller {
        overflow-x: scroll;
      }
      .photoscroller::-webkit-scrollbar,
      .photoscroller::-webkit-scrollbar-track,
      .photoscroller::-webkit-scrollbar-thumb {
        display: none;
      }
    </style>
  </div>
  <div
    id="w-node-b71f0895-5d5e-bb9e-3499-f8d3656596bb-586c9c2f"
    class="photowrapper hiddenontabletandmobile transition"
  >
    <img
      animation-images="true"
      class="image-17"
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b4b641125b8f72f838a1_Rectangle%20749-2.jpg"
      alt="Picture of a tattoo studio in Hamburg Hood Seven"
      sizes="(max-width: 991px) 100vw, 93vw"
      id="w-node-e46a2d9a-1476-dfc5-c855-2dd9cdb3c74f-586c9c2f"
      loading="lazy"
      srcset="
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b4b641125b8f72f838a1_Rectangle%20749-2-p-500.jpg 500w,
        https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/67b8b4b641125b8f72f838a1_Rectangle%20749-2.jpg       781w
      "
    />
  </div>
  <div
    id="w-node-e1c2ad89-17f1-3716-4d4f-ac181757de16-586c9c2f"
    class="photowrapper disableonmobile fullheight"
  >
    <div class="studio-video__wrapper">
      <div class="studio-video w-embed">
        <video
          muted=""
          autoplay=""
          loop=""
          playsinline=""
          style="width: 100%; height: 100%; object-fit: cover;"
        >
          <source
            src="https://3200kelvin-files.s3.eu-west-1.amazonaws.com/lass-tattoo/studio-video.mp4"
          />
        </video>
      </div>
    </div>
  </div>
  <div
    id="w-node-_328d771f-775f-4ab5-aaf1-66ddb5f8448c-586c9c2f"
    class="contactspot"
  >
    <h3 class="main-text bold contactheader">Studio</h3>
    <p class="main-text">Allskins Studios<br /></p>
  </div>
  <div
    id="w-node-_0dbf27e1-edca-c21a-3d00-1b1461b46df0-586c9c2f"
    class="contactspot"
  >
    <h3 class="main-text bold contactheader">Guest spots</h3>
    <ul role="list" class="list">
      <li>
        <a
          data-opensrequest="amsterdam"
          data-w-id="898d80b3-d18c-2db5-c6a8-18eed2fef958"
          href="#"
          class="contactentry w-inline-block"
          ><div
            data-w-id="bc0f6f02-a5fd-25d0-eada-ead32f0ab34d"
            class="bulletlistcircle"
            style="background-color: rgb(50, 50, 50);"
          ></div>
          <p
            data-w-id="f58ff2a4-ac5a-93f8-487b-fb702289eb0d"
            class="main-text link"
            style="color: rgb(50, 50, 50);"
          >
            Amsterdam waiting list
          </p>
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64329af8b89d66c26a6b9a89_Union.svg"
            loading="lazy"
            data-w-id="891a9002-89f4-ea8a-5b41-d0b0f57a2eee"
            alt=""
            class="linkarrow"
            style="opacity: 0;"
        /></a>
      </li>
      <li>
        <a
          data-opensrequest="paris"
          data-w-id="754ccc17-8ba8-e1ce-f417-13fb15b769e3"
          href="#"
          class="contactentry w-inline-block"
          ><div
            data-w-id="5f077c46-d8c8-9af8-08d6-fd2405e4f1ec"
            class="bulletlistcircle"
            style="background-color: rgb(50, 50, 50);"
          ></div>
          <p
            data-w-id="754ccc17-8ba8-e1ce-f417-13fb15b769e4"
            class="main-text link"
            style="color: rgb(50, 50, 50);"
          >
            Paris bookings are open
          </p>
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64329af8b89d66c26a6b9a89_Union.svg"
            loading="lazy"
            data-w-id="754ccc17-8ba8-e1ce-f417-13fb15b769e6"
            alt=""
            class="linkarrow"
            style="opacity: 0;"
        /></a>
      </li>
      <li>
        <a
          data-opensrequest="zurich"
          data-w-id="ef1533ba-b998-6780-29d6-27221934af26"
          href="#"
          class="contactentry w-inline-block"
          ><div
            data-w-id="706756d7-d98e-27c9-c141-27291a7f3c29"
            class="bulletlistcircle"
            style="background-color: rgb(50, 50, 50);"
          ></div>
          <p
            data-w-id="ef1533ba-b998-6780-29d6-27221934af27"
            class="main-text link"
            style="color: rgb(50, 50, 50);"
          >
            Zurich waiting list
          </p>
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64329af8b89d66c26a6b9a89_Union.svg"
            loading="lazy"
            width="10"
            data-w-id="ef1533ba-b998-6780-29d6-27221934af29"
            alt=""
            class="linkarrow"
            style="opacity: 0;"
        /></a>
      </li>
      <li>
        <a
          data-opensrequest="london"
          data-w-id="052a8533-c3bc-77da-9733-527e8579557b"
          href="#"
          class="contactentry w-inline-block"
          ><div
            data-w-id="cb107331-f6b4-6d6e-899a-a25cae18d44e"
            class="bulletlistcircle"
            style="background-color: rgb(50, 50, 50);"
          ></div>
          <p
            data-w-id="052a8533-c3bc-77da-9733-527e8579557c"
            class="main-text link"
            style="color: rgb(50, 50, 50);"
          >
            London waiting list
          </p>
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64329af8b89d66c26a6b9a89_Union.svg"
            loading="lazy"
            data-w-id="052a8533-c3bc-77da-9733-527e8579557e"
            alt=""
            class="linkarrow"
            style="opacity: 0;"
        /></a>
      </li>
    </ul>
    <p class="main-text">
      Please follow updates on
      <a href="https://www.instagram.com/lasstattoo/" class="link-4"
        >my&nbsp;Instagram</a
      >
      to&nbsp;know about my&nbsp;next&nbsp;guest spots<br />
    </p>
  </div>
</div>
<div class="contacts">
  <a
    data-openspopup="mobile-request"
    href="#"
    class="futureplansmobile w-button"
    >my future plans</a
  >
  <div class="sticky">
    <div
      id="w-node-bd13c8c8-2d44-e45b-74af-b964cd346ad2-586c9c2f"
      class="contactsheadliner"
    >
      <p class="descriptor textfooter">
        let me make your life easier, better and beautiful with my language
        of&nbsp;speaking to this world
      </p>
      <a
        animation-transition=""
        animation-button="true"
        href="/request"
        target="_blank"
        class="mainbutton w-button"
        >send request</a
      ><link rel="prerender" href="/request" />
    </div>
    <div
      id="w-node-_31a75d93-b2ba-7deb-21fc-870619e49935-586c9c2f"
      class="socialcontacts"
    >
      <div class="div-block-9">
        <h3 class="heading-6">Email me</h3>
        <a
          animation-flip=""
          href="mailto:lasstattoo@gmail.com?subject=Hey%20Lass!"
          class="link-2 show-by-letter shown"
          ><span class="line"
            ><span class="word"
              ><span class="letter" style='--letter-index: 0; --letter: "l";'
                >l</span
              ><span class="letter" style='--letter-index: 1; --letter: "a";'
                >a</span
              ><span class="letter" style='--letter-index: 2; --letter: "s";'
                >s</span
              ><span class="letter" style='--letter-index: 3; --letter: "s";'
                >s</span
              ><span class="letter" style='--letter-index: 4; --letter: "t";'
                >t</span
              ><span class="letter" style='--letter-index: 5; --letter: "a";'
                >a</span
              ><span class="letter" style='--letter-index: 6; --letter: "t";'
                >t</span
              ><span class="letter" style='--letter-index: 7; --letter: "t";'
                >t</span
              ><span class="letter" style='--letter-index: 8; --letter: "o";'
                >o</span
              ><span class="letter" style='--letter-index: 9; --letter: "o";'
                >o</span
              ><span class="letter" style='--letter-index: 10; --letter: "@";'
                >@</span
              ><span class="letter" style='--letter-index: 11; --letter: "g";'
                >g</span
              ><span class="letter" style='--letter-index: 12; --letter: "m";'
                >m</span
              ><span class="letter" style='--letter-index: 13; --letter: "a";'
                >a</span
              ><span class="letter" style='--letter-index: 14; --letter: "i";'
                >i</span
              ><span class="letter" style='--letter-index: 15; --letter: "l";'
                >l</span
              ><span class="letter" style='--letter-index: 16; --letter: ".";'
                >.</span
              ><span class="letter" style='--letter-index: 17; --letter: "c";'
                >c</span
              ><span class="letter" style='--letter-index: 18; --letter: "o";'
                >o</span
              ><span class="letter" style='--letter-index: 19; --letter: "m";'
                >m</span
              ></span
            ></span
          ></a
        >
      </div>
      <div>
        <h3 class="heading-6">Watch me on insta</h3>
        <a
          animation-flip=""
          href="https://www.instagram.com/lasstattoo/"
          target="_blank"
          class="link-2 show-by-letter shown"
          ><span class="line"
            ><span class="word"
              ><span class="letter" style='--letter-index: 0; --letter: "@";'
                >@</span
              ><span class="letter" style='--letter-index: 1; --letter: "l";'
                >l</span
              ><span class="letter" style='--letter-index: 2; --letter: "a";'
                >a</span
              ><span class="letter" style='--letter-index: 3; --letter: "s";'
                >s</span
              ><span class="letter" style='--letter-index: 4; --letter: "s";'
                >s</span
              ><span class="letter" style='--letter-index: 5; --letter: "t";'
                >t</span
              ><span class="letter" style='--letter-index: 6; --letter: "a";'
                >a</span
              ><span class="letter" style='--letter-index: 7; --letter: "t";'
                >t</span
              ><span class="letter" style='--letter-index: 8; --letter: "t";'
                >t</span
              ><span class="letter" style='--letter-index: 9; --letter: "o";'
                >o</span
              ><span class="letter" style='--letter-index: 10; --letter: "o";'
                >o</span
              ></span
            ></span
          ></a
        >
      </div>
    </div>
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642c73a05426305359fe472f_last-flower.png"
      loading="lazy"
      style="opacity: 1;"
      data-w-id="705eca7a-f704-ecf0-5231-74312d0e6f7d"
      alt=""
      id="w-node-_705eca7a-f704-ecf0-5231-74312d0e6f7d-586c9c2f"
      class="flower"
    />
    <div
      id="w-node-_168cc943-4991-7c22-8a1c-c50f62dd523d-586c9c2f"
      class="copyrightwrapper"
    >
      <h1
        animation-letters=""
        id="w-node-b8d6610b-e705-6244-c15b-4149747c0cfb-586c9c2f"
        class="heading-2 contactsheading show-by-letter transition shown"
        style="--anim-time: 0.8s;"
      >
        <span class="copyrightlass"
          ><span class="line"
            ><span class="word"
              ><span class="letter" style="--letter-index: 0;">l</span
              ><span class="letter" style="--letter-index: 1;">a</span
              ><span class="letter" style="--letter-index: 2;">s</span
              ><span class="letter" style="--letter-index: 3;">s</span></span
            ></span
          ></span
        ><span
          ><span class="line"
            ><span class="word"
              ><span class="letter" style="--letter-index: 4;">t</span
              ><span class="letter" style="--letter-index: 5;">a</span
              ><span class="letter" style="--letter-index: 6;">t</span
              ><span class="letter" style="--letter-index: 7;">t</span
              ><span class="letter" style="--letter-index: 8;">o</span
              ><span class="letter" style="--letter-index: 9;">o</span></span
            ></span
          ></span
        >
      </h1>
    </div>
  </div>
  <footer class="footer stickytopfix">
    <div class="footerheader">
      <p class="blocktitle futureplanstext">my future plans</p>
    </div>
    <div class="footercontent">
      <div
        id="w-node-_8017f55c-4e69-d1ca-32b4-359464b21bb3-586c9c2f"
        class="footerplan left"
      >
        <h2 class="futureplantitle">own clothing brand</h2>
        <a
          data-opensrequest="brand"
          href="#"
          class="futureplanlink w-inline-block"
          ><p class="footerbutton">be the first to know</p>
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64329af8b89d66c26a6b9a89_Union.svg"
            loading="lazy"
            alt=""
            class="footerbuttonarrow"
        /></a>
      </div>
      <div
        id="w-node-_4e050604-66a5-84b7-9e30-1fc56752e8b1-586c9c2f"
        class="footerplan"
      >
        <h2 class="futureplantitle">tattoo artist training</h2>
        <a
          data-opensrequest="training"
          href="#"
          class="futureplanlink w-inline-block"
          ><p class="footerbutton">be the first to know</p>
          <img
            src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64329af8b89d66c26a6b9a89_Union.svg"
            loading="lazy"
            alt=""
            class="footerbuttonarrow"
        /></a>
      </div>
    </div>
    <div class="copyright">
      <p class="copyrighttext">
        © lasstattoo. <span class="copyrightyear">2025</span>
      </p>
      <a href="https://dyotanya.com/en" target="_blank" class="copyrighttext"
        >Website made with love by <span class="text-span-3">Tanya Dyo</span></a
      >
    </div>
    <div class="w-embed w-script">
      <script>
        !(function setYear() {
          const text = document.querySelector(".copyrightyear"),
            date = new Date();
          text.textContent = date.getFullYear();
        })();
      </script>
    </div>
  </footer>
</div>
<div data-popupid="linda" class="storypopup">
  <div
    id="w-node-_7fee2697-5224-c1d2-dec1-d65ced470780-586c9c2f"
    class="popupcontent"
  >
    <div class="popupheader">
      <h3 class="popupheadertitle">Linda</h3>
      <div class="popuptitle">
        <img
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6431e06411af0d14c89ac175_The%20symbol.svg"
          loading="lazy"
          alt="The symbol"
          class="popuptitleimage"
        /><img
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6431e06d443cd29ba193bce6_of%20Freedom.svg"
          loading="lazy"
          alt="of Freedom"
          class="popuptitleimage right"
        />
      </div>
    </div>
    <p class="popupsynopsis">
      i always see in all of my girls braveness, fearlessness, honestness,
      refinement, easiness and beauty.
    </p>
    <p class="popupsynopsis">
      This what i always try to deliver on their skin through their story,
      characters, life experience and inner state.
    </p>
    <div class="popuptextcontainer">
      <p class="popuptext">
        one of the examples is Linda, she got her first tattoo session in her
        life with me, which means a lot. she trusted me from the first seconds
        and let me to make my art on her arm. we wanted to deliver freedom and
        beauty of this world, nature. she would like to travel around the world,
        be free and explore the japanese culture.<br /><br />Tattoo for her
        means symbol of a freedom.
      </p>
    </div>
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642e78080c8e501cfcdc8487_cross.svg"
      loading="lazy"
      data-closepopup="true"
      alt="Cross icon"
      class="popupcrossicon"
    />
  </div>
</div>
<div data-popupid="anais" class="storypopup">
  <div
    id="w-node-b8f2a11f-5153-f023-d140-6022abf7c141-586c9c2f"
    class="popupcontent"
  >
    <div class="popupheader">
      <h4 class="popupheadertitle">anais</h4>
      <div class="popuptitle">
        <img
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6431e2ba9d91c60bf2c308d8_The%20Feminine.svg"
          loading="lazy"
          alt="The Feminine"
          class="popuptitleimage"
        /><img
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6431e2d3443cd264b99429e3_Power.svg"
          loading="lazy"
          alt="Power"
          class="popuptitleimage right"
        />
      </div>
    </div>
    <p class="popupsynopsis anais">
      Most of the time i am creating the first pieces for my clients. I can say
      that it’s a big trust and  i am thankful and honoured to be their artist.
    </p>
    <div class="popuptextcontainer anais">
      <p class="popuptext">
        I remember the story with Anais, so fragile and unique soul at the same
        time i can see how her braveness and feminine power wants to show to the
        world that she is there and she is strong. <br /><br />She wanted to
        have airy sakura flowers combined with Japanese Umamori design in
        a&nbsp;very elegant way and from my side i made the combination of the
        delicate and strong design with a contrast. The result - we both were
        very happy.<br /><br />Thank you Anais for sharing with me your first
        experience.
      </p>
    </div>
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642e78080c8e501cfcdc8487_cross.svg"
      loading="lazy"
      data-closepopup="true"
      alt="Cross icon"
      class="popupcrossicon"
    />
  </div>
</div>
<div data-popupid="katharina" class="storypopup">
  <div
    id="w-node-fcc72c36-6aa5-96f7-e41b-af50800b3c1e-586c9c2f"
    class="popupcontent"
  >
    <div class="popupheader">
      <h4 class="popupheadertitle">Katharina</h4>
      <div class="popuptitle">
        <img
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6431e3af3f44a73a6b595866_A%20connection.svg"
          loading="lazy"
          alt="A connection"
          class="popuptitleimage"
        /><img
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6431e3c5b89d660781629360_of%20Souls.svg"
          loading="lazy"
          alt="of Souls"
          class="popuptitleimage right"
        />
      </div>
    </div>
    <p class="popupsynopsis anais">
      I love when my sessions becomes something more than just a session with
      you, i love it when we bond and exchange energies with each other.
    </p>
    <div class="popuptextcontainer anais">
      <p class="popuptext">
        Katharina - she is a smart, open, happy, joyful and pure soul. We had
        two days session with her and time flew like a shot. I even didn’t want
        to let her go, even my colleagues, i think everyone just fell in love
        with her. We talked about everything and she is so easy person to work
        with. i felt something in her, something similar to me.<br /><br />I
        created her design listening to her life story and we both were in love
        with her design.
      </p>
    </div>
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642e78080c8e501cfcdc8487_cross.svg"
      loading="lazy"
      data-closepopup="true"
      alt="Cross icon"
      class="popupcrossicon"
    />
  </div>
</div>
<div data-popupid="sara" class="storypopup">
  <div
    id="w-node-_393f24a6-ba40-6b1b-731d-7222f674229c-586c9c2f"
    class="popupcontent"
  >
    <div class="popupheader">
      <h4 class="popupheadertitle">sara</h4>
      <div class="popuptitle">
        <img
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6432b384b89d661bb76d17d6_Sunshine%20in%20Bloom.svg"
          loading="lazy"
          alt="Synshine in Bloom"
          class="popuptitleimage desktop"
        /><img
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6432b1c41ddcb0084de379d3_Sunshine.svg"
          loading="lazy"
          width="175"
          alt="Sunshine"
          class="popuptitleimage mobile"
        /><img
          src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/6432b1bc4fe56529f3761e3c_in%20Bloom.svg"
          loading="lazy"
          alt="in Bloom"
          class="popuptitleimage right mobile"
        />
      </div>
    </div>
    <p class="popupsynopsis anais">
      I am always in love with this powerful women who is over 40 and deciding
      to decorate their body because they want to and “now” it’s a time.
    </p>
    <div class="popuptextcontainer anais">
      <p class="popuptext">
        Sara will be always in my heart.<br /><br />She is a sunshine. She is a
        wife, mother of 2 kids, kindest soul in this world. I got inspired to
        make a canna lilies and sun ornament for her.<br /><br />Through the
        flowers we delivered the elegance, airiness and beauty, through the sun-
        ornament we got a jewellery piece, we added her shine, her strong inner
        state for this life cause she is strong and bright like a sunshine. She
        always smiles, next to her i felt like at home.
      </p>
    </div>
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/642e78080c8e501cfcdc8487_cross.svg"
      loading="lazy"
      data-closepopup="true"
      alt="Cross icon"
      class="popupcrossicon"
    />
  </div>
</div>
<div data-popupid="request" class="requestpopup">
  <div
    id="w-node-_187a6be5-d70c-7700-ff95-8b18e027e5c0-586c9c2f"
    class="popupcontent form"
  >
    <div class="popupheader">
      <h3 class="boldtitle requestpopuptitle">amsterdam<br />waiting list</h3>
    </div>
    <p class="popupsynopsis requestpopuptopic">
      leave your email and I will contact you when I&nbsp;plan a trip to
      Amsterdam
    </p>
    <img
      src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/64370cc72629e16b71b300a9_Frame%2070.svg"
      loading="lazy"
      data-closepopup="true"
      alt="Cross icon"
      class="popupcrossicon"
    />
    <div class="form-block w-form">
      <form
        id="wf-form-Waiting-list"
        name="wf-form-Waiting-list"
        data-name="Waiting list"
        method="get"
        class="waitinglistform"
        data-wf-page-id="64e32c49de0b81be586c9c2f"
        data-wf-element-id="592a0fa9-6a55-8cff-3843-8afe32c02c59"
        aria-label="Waiting list"
      >
        <input
          class="text-field-2 w-input"
          autofocus="true"
          maxlength="256"
          name="Email"
          data-name="Email"
          placeholder="janedoe@gmail.com"
          type="email"
          id="Email"
          required=""
        /><input
          class="text-field w-input"
          maxlength="256"
          name="topic"
          data-name="topic"
          placeholder=""
          type="text"
          id="topic-waiting-list"
        /><input
          type="submit"
          data-wait="Please wait..."
          class="mainbutton form w-button"
          value="Send request"
        />
      </form>
      <div
        class="w-form-done"
        tabindex="-1"
        role="region"
        aria-label="Waiting list success"
      >
        <div>Thank you! Your submission has been received!</div>
      </div>
      <div
        class="w-form-fail"
        tabindex="-1"
        role="region"
        aria-label="Waiting list failure"
      >
        <div>Oops! Something went wrong while submitting the form.</div>
      </div>
    </div>
  </div>
</div>
<div class="showbyletterscript w-embed w-script">
  <style>
    .show-by-letter {
      --anim-time: 1.5s;
      --flip-time: 0.6s;
    }
    .show-by-letter span.letter {
      position: relative;
      display: inline-block;
      height: 100%;
      transform: translateY(100%);
      white-space: pre;
    }
    .show-by-letter span.letter::after {
      content: var(--letter, "");
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 100%;
      left: 0;
    }
    .show-by-letter span.word {
      display: inline-block;
      height: 100%;
      overflow: hidden;
      white-space: nowrap;
    }
    .show-by-letter span.line {
      display: inline-flex;
    }
    .show-by-letter.transition span.letter {
      --delay: calc(var(--letter-index) * 0.05s);
      transition: transform var(--anim-time)
        cubic-bezier(0.54, 0.12, 0.47, 0.99);
      transition-delay: var(--delay, 0);
    }
    .show-by-letter.transition.flipping span.letter {
      --delay: calc(var(--letter-index) * 0.02s);
      transition: transform var(--flip-time)
        cubic-bezier(0.54, 0.12, 0.47, 0.99);
      transition-delay: var(--delay, 0);
    }
    .show-by-letter.shown span.letter {
      transform: translateY(0);
    }
    .show-by-letter.flip span.letter {
      transform: translateY(-100%);
    }
  </style>

  <script>
    function useShowByLetter(
      elem,
      {
        animTime: animTime,
        withFlip: withFlip = !1,
        skipAppearing: skipAppearing = !1,
      } = {},
    ) {
      let letterIndex = 0,
        isAnimating = !1;
      const createWord = (word, addSpace = !1) => {
          const newWord = document.createElement("span");
          newWord.classList.add("word");
          const letters = word.trim().split("");
          if (
            (letters.forEach((letter) => {
              if (!letter || " " === letter) return;
              const newLetter = document.createElement("span");
              (newLetter.classList.add("letter"),
                (newLetter.textContent = letter),
                newLetter.style.setProperty("--letter-index", letterIndex),
                withFlip &&
                  newLetter.style.setProperty("--letter", `"${letter}"`),
                (letterIndex += 1),
                newWord.appendChild(newLetter));
            }),
            addSpace)
          ) {
            const newLetter = document.createElement("span");
            (newLetter.classList.add("letter"),
              (newLetter.textContent = " "),
              newWord.appendChild(newLetter));
          }
          return newWord;
        },
        splitNode = (node) => {
          const newNode = node.cloneNode();
          if (node.childNodes && node.childNodes.length)
            return (
              (newNode.innerHTML = ""),
              node.childNodes.forEach((child) => {
                const newChild = splitNode(child);
                newNode.appendChild(newChild);
              }),
              newNode
            );
          if ("#text" === node.nodeName) {
            const newLine = document.createElement("span");
            newLine.classList.add("line");
            const words = node.textContent.split(" ");
            return (
              words.forEach((word, wordIndex) => {
                const addSpace = wordIndex < words.length - 1,
                  newWord = createWord(word, addSpace);
                (newWord.classList.add("word"), newLine.appendChild(newWord));
              }),
              newLine
            );
          }
          return node.textContent ? void 0 : newNode;
        },
        newElem = splitNode(elem);
      (newElem.classList.add("show-by-letter"),
        skipAppearing && newElem.classList.add("shown"),
        animTime && newElem.style.setProperty("--anim-time", `${animTime}s`));
      const letters = newElem.querySelectorAll("span.letter"),
        lastLetter = letters[letters.length - 1],
        onAnimationEnd = (callback) => {
          lastLetter.ontransitionend = () => {
            (callback(), (lastLetter.ontransitionend = null));
          };
        };
      return (
        (newElem.showLetters = () => {
          (newElem.classList.add("transition"),
            (isAnimating = !0),
            onAnimationEnd(() => {
              isAnimating = !1;
            }),
            setTimeout(() => {
              newElem.classList.add("shown");
            }, 5));
        }),
        withFlip &&
          (newElem.flipLetters = () => {
            newElem.classList.contains("shown") &&
              !isAnimating &&
              ((isAnimating = !0),
              newElem.classList.add("transition", "flipping"),
              onAnimationEnd(() => {
                (newElem.classList.remove("transition", "flipping"),
                  setTimeout(() => {
                    (newElem.classList.remove("flip"), (isAnimating = !1));
                  }, 5));
              }),
              setTimeout(() => {
                newElem.classList.add("flip");
              }, 5));
          }),
        elem.parentNode.replaceChild(newElem, elem),
        newElem
      );
    }
  </script>
</div>
<div class="popupopeningscript w-embed w-script">
  <style>
    html {
      overflow: auto;
    }
    .popup-opened {
      overflow: hidden;
      padding-right: var(--scroll-bar-width, 0);
    }
    .popup-opened .desktopnavigation {
      padding-right: calc(3.5vw + var(--scroll-bar-width, 0));
    }
    [data-popupid] {
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    [data-popupid].displayed {
      display: grid;
    }
    [data-popupid].shown {
      opacity: 1;
    }
    .mobilemenu.displayed {
      display: flex !important;
    }
  </style>

  <script defer="">
    !(function useStoryPopups() {
      const triggers = document.querySelectorAll("[data-openspopup]"),
        closers = document.querySelectorAll("[data-closepopup]");
      let opened = null;
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        "--scroll-bar-width",
        `${scrollBarWidth}px`,
      );
      const openPopup = (popup) => {
          (document.documentElement.classList.add("popup-opened"),
            popup.classList.add("displayed"),
            setTimeout(() => popup.classList.add("shown"), 5),
            (opened = popup));
        },
        closePopup = () => {
          opened &&
            ((opened.ontransitionend = () => {
              (document.documentElement.classList.remove("popup-opened"),
                opened.classList.remove("displayed"),
                (opened.ontransitionend = null));
            }),
            opened.classList.remove("shown"));
        };
      (triggers.forEach((trigger) => {
        const popup = document.querySelector(
          `[data-popupid="${trigger.dataset.openspopup}"]`,
        );
        popup && trigger.addEventListener("click", () => openPopup(popup));
      }),
        closers.forEach((closer) =>
          closer.addEventListener("click", closePopup),
        ));
    })();
  </script>
</div>
<div class="audioscript w-embed w-script">
  <audio class="background-audio" loop="">
    <source
      src="https://sv-file-storage.netlify.app/lass/sea.mp3"
      type="audio/mpeg"
    />
    <source
      src="https://sirgoosethenaughty.github.io/file-storage/lass/sea.mp3"
      type="audio/mpeg"
    />
  </audio>

  <style>
    .background-audio {
      display: none;
    }
    .soundwavesbutton div {
      flex-shrink: 0;
    }
    .soundwavesbutton div:nth-of-type(0) {
      -webkit-animation-delay: 0s !important;
      animation-delay: 0s !important;
    }
    .soundwavesbutton div:nth-of-type(1) {
      -webkit-animation-delay: 0.3s !important;
      animation-delay: 0.3s !important;
    }
    .soundwavesbutton div:nth-of-type(2) {
      -webkit-animation-delay: 0.2s !important;
      animation-delay: 0.2s !important;
    }
    .soundwavesbutton div:nth-of-type(3) {
      -webkit-animation-delay: 0.4s !important;
      animation-delay: 0.4s !important;
    }
    .soundwavesbutton div:nth-of-type(4) {
      -webkit-animation-delay: 0.1s !important;
      animation-delay: 0.1s !important;
    }
    .soundwavesbutton.playing div {
      -webkit-animation: soundflipflop 0.8s linear infinite forwards;
      animation: soundflipflop 0.8s linear infinite forwards;
    }
    @-webkit-keyframes soundflipflop {
      0% {
        height: 15%;
      }
      50% {
        height: 45%;
      }
      100% {
        height: 15%;
      }
    }
    @keyframes soundflipflop {
      0% {
        height: 15%;
      }
      50% {
        height: 45%;
      }
      100% {
        height: 15%;
      }
    }
  </style>

  <script defer="">
    !(function useBackgroundAudio(maxVolume = 1) {
      const audio = document.querySelector(".background-audio"),
        triggers = document.querySelectorAll("[data-audiotrigger]"),
        initialTrigger = document.querySelector("[data-audioinitialtrigger]");
      let playingVolume = maxVolume;
      const volumeIncrement = maxVolume / 20;
      let softenTimeout,
        paused = !0,
        changingVolume = !1;
      const docHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight,
        ),
        isIOS =
          [
            "iPad Simulator",
            "iPhone Simulator",
            "iPod Simulator",
            "iPad",
            "iPhone",
            "iPod",
          ].includes(navigator.platform) ||
          (navigator.userAgent.includes("Mac") && "ontouchend" in document);
      isIOS || (audio.volume = 0);
      const play = () => {
          ((paused = !1),
            audio
              .play()
              .then(() => {
                (triggers.forEach((trigger) =>
                  trigger.classList.add("playing"),
                ),
                  softenVolume(playingVolume));
              })
              .catch(console.error));
        },
        pause = () => {
          ((paused = !0),
            isIOS ? audio.pause() : softenVolume(0),
            triggers.forEach((trigger) => trigger.classList.remove("playing")));
        },
        softenVolume = (volume) => {
          (clearTimeout(softenTimeout), (changingVolume = !0));
          let toBePaused = !1,
            stopLoop = !1;
          const newVolume = paused
            ? audio.volume - volumeIncrement
            : audio.volume + volumeIncrement;
          (newVolume >= playingVolume
            ? ((audio.volume = playingVolume), (stopLoop = !0))
            : newVolume <= 0.005
              ? ((audio.volume = 0), (toBePaused = !0), (stopLoop = !0))
              : (audio.volume = newVolume),
            toBePaused && audio.pause && audio.pause(),
            stopLoop
              ? (changingVolume = !1)
              : (softenTimeout = setTimeout(() => softenVolume(volume), 50)));
        },
        handleTriggerClick = () => {
          (paused !== audio.paused && clearTimeout(softenTimeout),
            audio.paused ? play() : pause());
        },
        scrollListener = () => {
          const progress = Math.pow(1 - window.scrollY / docHeight, 2);
          ((playingVolume = Math.round(maxVolume * progress * 100) / 100),
            paused ||
              changingVolume ||
              (audio.volume = Math.min(playingVolume, maxVolume)));
        };
      (initialTrigger &&
        initialTrigger.addEventListener("click", () => {
          play();
        }),
        triggers.forEach((trigger) =>
          trigger.addEventListener("click", handleTriggerClick),
        ),
        isIOS || window.addEventListener("scroll", scrollListener));
    })();
  </script>
</div>
<div class="preloaderscript w-embed w-script">
  <style>
    .preloadercenter {
      padding-right: var(--scroll-bar-width, 0);
    }
  </style>

  <script>
    !(function usePreloader() {
      const preloader = document.querySelector(".preloader"),
        picture = preloader.querySelector(".preloaderpicture"),
        shape = preloader.querySelector(".preloaderwhiteshape"),
        startBtn = preloader.querySelector(".mainbutton.explore"),
        center = preloader.querySelector(".preloadercenter"),
        firstScreen = document.querySelector(".firstscreen"),
        lass = firstScreen.querySelector(".lass"),
        tattoo = firstScreen.querySelector(".tattoo"),
        navigation = firstScreen.querySelectorAll(".menu .link"),
        caption = firstScreen.querySelector(".tatooartist"),
        mainBtn = firstScreen.querySelector(".mainbutton");
      if (sessionStorage.getItem("loaded"))
        return (
          [...navigation].forEach((nav) => {
            const newNavElem = useShowByLetter(nav, {
                withFlip: !0,
                skipAppearing: !0,
              }),
              { flipLetters: flipLetters } = newNavElem;
            newNavElem.addEventListener("mouseenter", flipLetters);
          }),
          preloader.remove(),
          mainBtn.classList.remove("hidden"),
          (caption.style.transition = "none"),
          void (caption.style.opacity = 1)
        );
      ((mainBtn.style.pointerEvents = "none"),
        (document.body.scrollTop = document.documentElement.scrollTop = 0),
        window.scrollTo(0, 0));
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      (document.documentElement.style.setProperty(
        "--scroll-bar-width",
        `${scrollBarWidth}px`,
      ),
        document.documentElement.classList.add("popup-opened"));
      const { showLetters: showLass } = useShowByLetter(lass),
        { showLetters: showTattoo } = useShowByLetter(tattoo),
        showNavigationFns = [...navigation].map((nav) => {
          const newNavElem = useShowByLetter(nav, { withFlip: !0 }),
            { showLetters: showLetters, flipLetters: flipLetters } = newNavElem;
          return (
            newNavElem.addEventListener("mouseenter", flipLetters),
            showLetters
          );
        }),
        showNavigation = () => showNavigationFns.forEach((fn) => fn()),
        showCaption = () => (caption.style.opacity = 1),
        showBtn = () => {
          ((mainBtn.style.pointerEvents = "auto"),
            mainBtn.classList.remove("hidden"));
        },
        animate = () => {
          ((shape.ontransitionend = () => {
            (picture.remove(),
              showLass(),
              (center.style.opacity = "0"),
              setTimeout(() => {
                (showTattoo(), showNavigation(), showBtn());
              }, 500),
              setTimeout(showCaption, 1500),
              setTimeout(() => {
                document.documentElement.classList.remove("popup-opened");
              }, 2e3),
              (shape.ontransitionend = () => {
                (preloader.remove(), sessionStorage.setItem("loaded", !0));
              }),
              (shape.style.opacity = 0));
          }),
            window.scrollTo(0, 0),
            (startBtn.style.opacity = 1),
            (shape.style.transform = "scale(1)"));
        };
      startBtn.addEventListener("click", animate);
    })();
  </script>
</div>
<div class="stickyfix w-embed">
  <style>
    .stickytopfix {
      -webkit-transform: translate3d(0, 0, 0);
    }
  </style>
</div>
<div class="requestformscript w-embed w-script">
  <style>
    .requestpopup {
      opacity: 0 !important;
      transition: opacity 0.4s ease;
    }
    .requestpopup.displayed {
      display: grid !important;
    }
    .requestpopup.shown {
      opacity: 1 !important;
    }
    .requestpopup .requestpopuptitle {
      white-space: pre;
    }
  </style>

  <script>
    !(function useRequestForm() {
      const popup = document.querySelector('[data-popupid="request"]'),
        triggers = document.querySelectorAll("[data-opensrequest]"),
        headerText = popup.querySelector(".requestpopuptitle"),
        topicText = popup.querySelector(".requestpopuptopic"),
        topicInput = popup.querySelector('input[name="topic"]'),
        closeBtn = popup.querySelector("[data-closepopup]"),
        cities = ["amsterdam", "paris", "zurich", "london"],
        getCityTitle = (city) => `${city}\nwaiting list`,
        getCityText = (city) =>
          `leave your email and I will contact you when I&nbsp;plan a trip to ${city}`,
        fillPopup = (topic) => {
          (cities.includes(topic)
            ? ((headerText.textContent = getCityTitle(topic)),
              (topicText.innerHTML = getCityText(topic)))
            : "brand" === topic
              ? ((headerText.textContent = "own clothing\nbrand"),
                (topicText.textContent =
                  "If you leave your email, I promise to keep you in the loop and let you know when I'm ready to launch."))
              : "training" === topic
                ? ((headerText.textContent = "tattoo artist\ntraining"),
                  (topicText.textContent =
                    "Just drop your email with me, and I'll make sure to let you know when my training program is ready to rock and roll."))
                : ((headerText.textContent = "get in touch"),
                  (topicText.textContent =
                    "Just drop your email with me, and I'll make sure to get in touch with you.")),
            (topicInput.value = topic));
        },
        openPopup = (topic) => {
          (fillPopup(topic),
            document.documentElement.classList.add("popup-opened"),
            popup.classList.add("displayed"),
            setTimeout(() => popup.classList.add("shown"), 5));
        },
        closePopup = () => {
          ((popup.ontransitionend = () => {
            (document.documentElement.classList.remove("popup-opened"),
              popup.classList.remove("displayed"),
              (popup.ontransitionend = null));
          }),
            popup.classList.remove("shown"));
        };
      (triggers.forEach((trigger) => {
        trigger.addEventListener("click", () =>
          openPopup(trigger.dataset.opensrequest),
        );
      }),
        closeBtn.addEventListener("click", closePopup),
        popup.addEventListener("click", (event) => {
          event.target === popup && closePopup();
        }));
    })();
  </script>
</div>
<div class="desktopnavigationscript w-embed w-script">
  <style>
    .desktopnavigation {
      transition: transform 0.4s ease;
    }
    .desktopnavigation.shown {
      transform: translateY(0);
    }
  </style>

  <script defer="">
    !(function useDesktopNavigation() {
      const nav = document.querySelector(".desktopnavigation"),
        links = nav.querySelectorAll(".desktopnavlink, .mainbuttonnav");
      let resizeTimeout;
      const handleScroll = () => {
          window.scrollY > document.documentElement.clientHeight
            ? nav.classList.add("shown")
            : nav.classList.remove("shown");
        },
        handleResize = () => {
          (clearTimeout(resizeTimeout),
            (resizeTimeout = setTimeout(() => {
              document.documentElement.clientWidth > 1024
                ? (window.addEventListener("scroll", handleScroll),
                  handleScroll())
                : window.removeEventListener("scroll", handleScroll);
            })));
        };
      (document.documentElement.clientWidth > 1024 &&
        (window.addEventListener("scroll", handleScroll), handleScroll()),
        matchMedia("(pointer:fine)").matches &&
          links.forEach((link) => {
            const newLink = useShowByLetter(link, {
                withFlip: !0,
                skipAppearing: !0,
              }),
              { flipLetters: flipLetters } = newLink;
            newLink.addEventListener("mouseenter", flipLetters);
          }),
        window.addEventListener("resize", handleResize));
    })();
  </script>
</div>
<div class="textsappearingscripts w-embed w-script">
  <script defer="">
    !(function initAllTexts() {
      const allTexts = document.querySelectorAll("[animation-letters]"),
        observer = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            entry.isIntersecting &&
              (entry.target.showLetters(), observer.unobserve(entry.target));
          });
        });
      allTexts.forEach((text) => {
        const newText = useShowByLetter(text, { animTime: 0.8 });
        observer.observe(newText);
      });
    })();
  </script>

  <script defer="">
    !(function useFlippingTexts() {
      const texts = document.querySelectorAll("[animation-flip]");
      texts.forEach((text) => {
        const newText = useShowByLetter(text, {
            withFlip: !0,
            skipAppearing: !0,
          }),
          trigger = newText.closest("[animation-flip-trigger]") || newText;
        trigger.addEventListener("mouseenter", newText.flipLetters);
      });
    })();
  </script>
</div>
<div class="smoothscrollscript w-embed w-script">
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/smoothscroll/1.4.10/SmoothScroll.min.js"
    integrity="sha256-huW7yWl7tNfP7lGk46XE+Sp0nCotjzYodhVKlwaNeco="
    crossorigin="anonymous"
  ></script>
  <script>
    SmoothScroll({
      animationTime: 800,
      stepSize: 75,
      accelerationDelta: 30,
      accelerationMax: 2,
      keyboardSupport: true,
      arrowScroll: 50,
      pulseAlgorithm: true,
      pulseScale: 4,
      pulseNormalize: 1,
      touchpadSupport: true,
    });
  </script>
</div>
<div class="photosscript w-embed w-script">
  <style>
    .photowrapper {
      height: -webkit-max-content;
      height: -moz-max-content;
      height: max-content;
      -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
    .photowrapper.clipped:not(.noclip) {
      --top: clamp(5%, 150px, 60%);
      -webkit-clip-path: polygon(
        0 var(--top),
        100% var(--top),
        100% 100%,
        0 100%
      );
      clip-path: polygon(0 var(--top), 100% var(--top), 100% 100%, 0 100%);
    }
    .photowrapper.clipped [animation-images] {
      transform: scale(1.3) translateY(10%);
    }
    .photowrapper.transition {
      transition: -webkit-clip-path 1.8s cubic-bezier(0.54, 0.12, 0.47, 0.99);
      transition: clip-path 1.8s cubic-bezier(0.54, 0.12, 0.47, 0.99);
      transition:
        clip-path 1.8s cubic-bezier(0.54, 0.12, 0.47, 0.99),
        -webkit-clip-path 1.8s cubic-bezier(0.54, 0.12, 0.47, 0.99);
    }
    .photowrapper.transition [animation-images] {
      transition: transform 1.8s cubic-bezier(0.54, 0.12, 0.47, 0.99);
    }
  </style>

  <script defer="">
    !(function usePhotos() {
      const photos = document.querySelectorAll("[animation-images]"),
        observer = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            entry.isIntersecting &&
              (entry.target.classList.add("transition"),
              setTimeout(() => entry.target.classList.remove("clipped"), 5),
              observer.unobserve(entry.target));
          });
        });
      photos.forEach((photo) => {
        const wrapper = photo.closest(".photowrapper"),
          noClip = !!photo.dataset.noclip;
        wrapper &&
          (wrapper.classList.add("clipped"),
          noClip && wrapper.classList.add("noclip"),
          observer.observe(wrapper));
      });
    })();
  </script>
</div>
<div class="stylebundle w-embed">
  <style>
    [animation-button] {
      position: relative;
      overflow: hidden;
      transition:
        opacity 0.6s,
        color 0.6s linear 0.1s,
        border-color 0.6s;
    }
    [animation-button]::after {
      content: "";
      display: block;
      width: 200%;
      height: 200%;
      position: absolute;
      top: 100%;
      left: -50%;
      border-radius: 100%;
      background-color: #b64b4b;
      transform-origin: center;
      transition: transform 0.8s cubic-bezier(0.54, 0.12, 0.47, 0.99);
      z-index: -1;
    }
    [animation-button]:hover {
      color: #f9f8f6;
      border-color: #b64b4b;
    }
    [animation-button]:hover::after {
      transform: translateY(-80%);
    }
  </style>
</div>
<script
  src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=641db0b9c215ec63737144e2"
  type="text/javascript"
  integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
  crossorigin="anonymous"
></script>
<script
  src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/js/webflow.schunk.36b8fb49256177c8.js"
  type="text/javascript"
></script>
<script
  src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/js/webflow.schunk.3b58b0126ec020df.js"
  type="text/javascript"
></script>
<script
  src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/js/webflow.schunk.41cbfa391da00456.js"
  type="text/javascript"
></script>
<script
  src="https://cdn.prod.website-files.com/641db0b9c215ec63737144e2/js/webflow.b0d0b857.e50f7adb1367fa7e.js"
  type="text/javascript"
></script>
```
