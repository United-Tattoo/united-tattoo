export interface Artist {
    id: number
    slug: string
    name: string
    title: string
    specialty: string
    faceImage: string
    workImages: string[]
    bio: string
    experience: string
    rating: number
    reviews: number
    availability: string
    styles: string[]
    description1: {
        text: string
        details: string[]
    }
    description2?: {
        text: string
        details: string[]
    }
    description3?: {
        text: string
        details: string[]
    }
    instagram?: string
    facebook?: string
    twitter?: string
}

export const artists: Artist[] = [
    {
        id: 1,
        slug: "christy-lumberg",
        name: "Christy Lumberg",
        title: "The Ink Mama",
        specialty: "Expert Cover-Up & Illustrative Specialist",
        faceImage: "/artists/christy-lumberg-portrait.jpg",
        workImages: [
            "/artists/christy-lumberg-work-1.jpg",
            "/artists/christy-lumberg-work-2.jpg",
            "/artists/christy-lumberg-work-3.jpg",
            "/artists/christy-lumberg-work-4.jpg"
        ],
        bio: "With over 22 years of experience, Christy Lumberg is a powerhouse in the tattoo industry, known for her exceptional cover-ups, tattoo makeovers, and bold illustrative designs.",
        experience: "22+ years",
        rating: 5.0,
        reviews: 245,
        availability: "Available",
        styles: ["Cover-ups", "Illustrative", "Black & Grey", "Color Work", "Tattoo Makeovers"],
        description1: {
            text: "Meet Christy Lumberg - The Ink Mama of United Tattoo",
            details: [
                "With over 22 years of experience, Christy Lumberg is a powerhouse in the tattoo industry, known for her exceptional cover-ups, tattoo makeovers, and bold illustrative designs.",
                "Whether you're looking to transform old ink, refresh a faded piece, or bring a brand-new vision to life, Christy's precision and artistry deliver next-level results."
            ]
        },
        description2: {
            text: "CEO & Trusted Artist",
            details: [
                "As the CEO of United Tattoo, based in Fountain and Colorado Springs, she has cultivated a space where artistry, creativity, and expertise thrive.",
                "Clients travel from all over to sit in her chair—because when it comes to experience, Christy is the name you trust."
            ]
        },
        description3: {
            text: "Specialties & Portfolio",
            details: [
                "✔ Cover-Up Specialist – Turning past ink into stunning new pieces.",
                "✔ Tattoo Makeovers – Revitalizing and enhancing faded tattoos.",
                "✔ Illustrative Style – From bold black-and-grey to vibrant, intricate designs.",
                "✔ Trusted Artist in Fountain & Colorado Springs – A leader in the local tattoo scene.",
                "Before & After cover-ups and transformations.",
                "Illustrative masterpieces in full color and black and grey."
            ]
        },
        instagram: "https://www.instagram.com/inkmama719",
        facebook: "",
        twitter: ""
    },
    {
        id: 2,
        slug: "angel-andrade",
        name: "Angel Andrade",
        title: "",
        specialty: "Precision in the details",
        faceImage: "",
        workImages: [
            "/artists/angel-andrade-work-1.jpg",
            "/artists/angel-andrade-work-2.jpg",
            "/artists/angel-andrade-work-3.jpg",
            "/artists/angel-andrade-work-4.jpg"
        ],
        bio: "From lifelike micro designs to clean, modern aesthetics, Angel's tattoos are proof that big impact comes in small packages.",
        experience: "5 years",
        rating: 4.8,
        reviews: 89,
        availability: "Available",
        styles: ["Fine Line", "Micro Realism", "Black & Grey", "Minimalist", "Geometric"],
        description1: {
            text: "Precision in the details",
            details: [
                "From lifelike micro designs to clean, modern aesthetics, Angel's tattoos are proof that big impact comes in small packages.",
                "Angel specializes in fine line work and micro realism, creating intricate designs that showcase exceptional attention to detail."
            ]
        }
    },
    {
        id: 3,
        slug: "amari-rodriguez",
        name: "Amari Kyss",
        title: "",
        specialty: "American & Japanese Traditional",
        faceImage: "/artists/amari-rodriguez-portrait.jpg",
        workImages: [
            "/artists/amari-rodriguez-work-1.jpg",
            "/artists/amari-rodriguez-work-2.jpg",
            "/artists/amari-rodriguez-work-3.jpg"
        ],
        bio: "Colorado Springs Tattoo artist focused on creating meaningful, timeless work that blends bold color traditional with black and grey stipple styles.",
        experience: "",
        rating: 5.0,
        reviews: 12,
        availability: "Available",
        styles: ["American/Japanese Traditional", "Neo-Traditional", "Black & Grey", "Fine Line", "Lettering"],
        description1: {
            text: "Rising Talent",
            details: [
                "Amari Tattoos with love and intention. She puts her heart into every piece she creates."
            ]
        }
    },
    {
        id: 4,
        slug: "donovan-lankford",
        name: "Donovan Lankford",
        title: "",
        specialty: "Boldly Illustrated",
        faceImage: "/artists/donovan-lankford-portrait.jpg",
        workImages: [
            "/artists/donovan-lankford-work-1.jpg",
            "/artists/donovan-lankford-work-2.jpg",
            "/artists/donovan-lankford-work-3.jpg",
            "/artists/donovan-lankford-work-4.jpg"
        ],
        bio: "Donovan's artistry seamlessly merges bold and intricate illustrative details, infusing each tattoo with unparalleled passion and creativity.",
        experience: "8 years",
        rating: 4.9,
        reviews: 167,
        availability: "Available",
        styles: ["Anime", "Illustrative", "Black & Grey", "Dotwork", "Neo-Traditional"],
        description1: {
            text: "Boldly Illustrated",
            details: [
                "Donovan's artistry seamlessly merges bold and intricate illustrative details, infusing each tattoo with unparalleled passion and creativity.",
                "From anime-inspired designs to striking black and grey illustrative work and meticulous dotwork, his versatility brings every vision to life."
            ]
        }
    },
    {
        id: 5,
        slug: "efrain-ej-segoviano",
        name: "Efrain 'EJ' Segoviano",
        title: "",
        specialty: "Evolving Boldly",
        faceImage: "/artists/ej-segoviano-portrait.jpg",
        workImages: [
            "/artists/ej-segoviano-work-1.jpg",
            "/artists/ej-segoviano-work-2.jpg",
            "/artists/ej-segoviano-work-3.jpg"
        ],
        bio: "EJ is a self-taught tattoo artist redefining creativity with fresh perspectives and undeniable skill.",
        experience: "6 years",
        rating: 4.7,
        reviews: 93,
        availability: "Available",
        styles: ["Black & Grey", "High Contrast", "Realism", "Illustrative"],
        description1: {
            text: "Evolving Boldly",
            details: [
                "EJ is a self-taught tattoo artist redefining creativity with fresh perspectives and undeniable skill.",
                "A rising star in the industry, his high-contrast black and grey designs showcase a bold, evolving artistry that leaves a lasting impression."
            ]
        }
    },
    {
        id: 6,
        slug: "heather-santistevan",
        name: "Heather Santistevan",
        title: "",
        specialty: "Art in Motion",
        faceImage: "",
        workImages: [
            "/artists/heather-santistevan-work-1.jpg",
            "/artists/heather-santistevan-work-2.jpg",
            "/artists/heather-santistevan-work-3.jpg",
            "/artists/heather-santistevan-work-4.jpg"
        ],
        bio: "With a creative journey spanning since 2012, Heather brings unmatched artistry to the tattoo world.",
        experience: "12+ years",
        rating: 4.8,
        reviews: 178,
        availability: "Limited slots",
        styles: ["Watercolor", "Embroidery Style", "Patchwork", "Illustrative", "Color Work"],
        description1: {
            text: "Art in Motion",
            details: [
                "With a creative journey spanning since 2012, Heather Santistevan brings unmatched artistry to the tattoo world.",
                "Specializing in vibrant watercolor designs and intricate embroidery-style patchwork, her work turns skin into stunning, wearable art."
            ]
        }
    },
    {
        id: 7,
        slug: "john-lapides",
        name: "John Lapides",
        title: "",
        specialty: "Sharp and Crisp",
        faceImage: "/artists/john-lapides-portrait.jpg",
        workImages: [
            "/artists/john-lapides-work-1.jpg",
            "/artists/john-lapides-work-2.jpg",
            "/artists/john-lapides-work-3.jpg"
        ],
        bio: "John's artistic arsenal is as sharp as his tattoos, specializing in fine line, blackwork, geometric patterns, and neo-traditional styles.",
        experience: "10 years",
        rating: 4.9,
        reviews: 142,
        availability: "Available",
        styles: ["Fine Line", "Blackwork", "Geometric", "Neo-Traditional", "Dotwork"],
        description1: {
            text: "Sharp and Crisp",
            details: [
                "John's artistic arsenal is as sharp as his tattoos, specializing in fine line, blackwork, geometric patterns, and neo-traditional styles.",
                "Each piece reflects his crisp precision and passion for pushing the boundaries of tattoo artistry."
            ]
        }
    },
    {
        id: 8,
        slug: "pako-martinez",
        name: "Pako Martinez",
        title: "",
        specialty: "Traditional Artistry",
        faceImage: "",
        workImages: [
            "/artists/pako-martinez-work-1.jpg",
            "/artists/pako-martinez-work-2.jpg",
            "/artists/pako-martinez-work-3.jpg"
        ],
        bio: "Master of traditional tattoo artistry bringing bold lines and vibrant colors to life.",
        experience: "7 years",
        rating: 4.6,
        reviews: 98,
        availability: "Available",
        styles: ["Traditional", "American Traditional", "Neo-Traditional", "Color Work"],
        description1: {
            text: "Traditional Master",
            details: [
                "Pako brings traditional tattoo artistry to life with bold lines and vibrant colors.",
                "Specializing in American traditional and neo-traditional styles."
            ]
        }
    },
    {
        id: 9,
        slug: "steven-sole-cedre",
        name: "Steven 'Sole' Cedre",
        title: "It has to have soul, Sole!",
        specialty: "Gritty Realism & Comic Art",
        faceImage: "/artists/steven-sole-cedre.jpg",
        workImages: [
            "/artists/sole-cedre-work-1.jpg",
            "/artists/sole-cedre-work-2.jpg",
            "/artists/sole-cedre-work-3.jpg",
            "/artists/sole-cedre-work-4.jpg"
        ],
        bio: "Embark on an epic journey with Steven 'Sole' Cedre, a creative force with over three decades of electrifying artistry.",
        experience: "30+ years",
        rating: 5.0,
        reviews: 287,
        availability: "Limited slots",
        styles: ["Realism", "Comic Book", "Black & Grey", "Portraits", "Illustrative"],
        description1: {
            text: "It has to have soul, Sole!",
            details: [
                "Embark on an epic journey with Steven 'Sole' Cedre, a creative force with over three decades of electrifying artistry.",
                "Fusing gritty realism with bold, comic book-inspired designs, Sole's tattoos are a dynamic celebration of storytelling and imagination."
            ]
        }
    },
    {
        id: 10,
        slug: "deziree-stanford",
        name: "Deziree Stanford",
        title: "",
        specialty: "Apprentice Artist",
        faceImage: "",
        workImages: [],
        bio: "Passionate apprentice artist bringing fresh creativity and dedication to every piece.",
        experience: "Apprentice",
        rating: 4.5,
        reviews: 0,
        availability: "Available",
        styles: ["Traditional", "Black & Grey", "Fine Line"],
        description1: {
            text: "Emerging Talent",
            details: [
                "Deziree is our talented apprentice, learning the craft of tattooing under expert guidance.",
                "Bringing enthusiasm and artistic passion to United Tattoo."
            ]
        }
    },
    {
        id: 11,
        slug: "kaori-cedre",
        name: "Kaori Cedre",
        title: "",
        specialty: "Artistic Expression",
        faceImage: "",
        workImages: [],
        bio: "Skilled tattoo artist bringing creativity and precision to every design.",
        experience: "5+ years",
        rating: 4.8,
        reviews: 0,
        availability: "Available",
        styles: ["Black & Grey", "Fine Line", "Illustrative", "Color Work"],
        description1: {
            text: "Creative Vision",
            details: [
                "Kaori brings artistic vision and technical skill to United Tattoo.",
                "Specializing in designs that blend precision with creative expression."
            ]
        }
    }
]

export const getArtistById = (id: number): Artist | undefined => {
    return artists.find(artist => artist.id === id)
}

export const getArtistBySlug = (slug: string): Artist | undefined => {
    return artists.find(artist => artist.slug === slug)
}
