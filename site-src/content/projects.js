export const projects = [
  {
    slug: "game-image-generation",
    title: "Enhanced Game Image Generation AI Service Development and Feature Integration",
    venue: "Neowiz, Jan 2024 - Present",
    cardDescription:
      "Developed and iteratively improved a studio-specific AI image generation workflow for concept artists, rapidly integrating new deep learning methods for IP-consistent concept art generation, style transfer, and background variation.",
    cardImage: {
      src: "images/PnP/Pnp_Image_Generation_Serive.png",
      alt: "Game image generation AI service project",
    },
    detail: {
      metaDescription:
        "Project detail page for game image generation AI service development by Jin-Hyeong Park.",
      intro:
        "This project focused on building and continuously improving a studio-specific image generation workflow for game art production by rapidly adapting new deep learning methods to practical artist needs.",
      organization: "Neowiz",
      period: "Jan 2024 - Present",
      keywords:
        "Image processing, diffusion models, game art generation, workflow integration",
      heroImage: "images/PnP/Pnp_Image_Generation_Serive.png",
      heroAlt: "Game image generation AI service project",
      overview: [
        "The work centered on turning recent generative modeling advances into usable internal tools for real game art production. Rather than applying generic text-to-image workflows as-is, the project emphasized studio-specific generation, image-to-image controllability, and IP consistency for concept art generation, style transfer, and background variation.",
        "A key part of the project was continuously tracking new deep learning methods and translating them into practical workflow improvements under production constraints. Over long-term deployment, this led not only to a useful internal system, but also to a clearer understanding of how modern generative models can support reliable, controllable visual content creation.",
      ],
      mediaLinks: [],
    },
  },
  {
    slug: "hair-guide",
    title: "Automated Hair Guide Model Generation for Game Characters from 3D Reconstruction",
    venue: "Neowiz, Apr 2024 - Nov 2024",
    cardDescription:
      "Designed a hair guide model generation pipeline for game hair production using geometry processing, clustering, importance sampling, and resampling.",
    cardImage: {
      src: "images/PnP/Pnp_Hair_Modeling.png",
      alt: "Hair guide model generation",
    },
    detail: {
      metaDescription:
        "Project detail page for automated hair guide model generation from 3D reconstruction by Jin-Hyeong Park.",
      intro:
        "This detail page keeps the same visual tone and section logic as the main page while giving one project more room for explanation.",
      organization: "Neowiz",
      period: "Apr 2024 - Nov 2024",
      keywords: "Geometry processing, 3D content generation, inverse rendering",
      heroImage: "images/PnP/Pnp_Hair_Modeling.png",
      heroAlt: "Hair guide model generation pipeline",
      overview: [
        "This project focused on optimizing the creation of game hair models by generating hair guide structures from reconstructed 3D data. The pipeline combined geometry processing techniques including clustering, importance sampling, and resampling.",
        "The work was motivated by practical production needs rather than purely isolated experiments. The goal was to reduce manual overhead in early hair modeling stages while preserving enough structure for downstream artistic control and refinement.",
      ],
      mediaLinks: [],
    },
  },
  {
    slug: "lip-sync-emotion",
    title: "Development of Facial Animation Pipeline for Lip Sync and Emotion",
    venue: "Neowiz, Aug 2022 - Oct 2022",
    cardDescription:
      "Designed and implemented an automated pipeline for facial animation generation using speech-to-viseme and script-based sentiment cues.",
    cardImage: {
      src: "images/PnP/PnP_Lip_Sync.png",
      alt: "Lip sync and emotion pipeline",
    },
    cardLinks: [{ href: "https://youtu.be/VZ4Cizmscx0", label: "video" }],
    detail: {
      metaDescription:
        "Project detail page for facial animation pipeline development for lip sync and emotion by Jin-Hyeong Park.",
      intro:
        "This project focused on automating facial animation for cartoon-style characters by combining audio-driven lip sync with script-level emotion cues.",
      organization: "Neowiz",
      period: "Aug 2022 - Oct 2022",
      keywords: "Signal processing, multivariate prediction, sentiment analysis",
      heroImage: "images/PnP/PnP_Lip_Sync.png",
      heroAlt: "Lip sync and emotion pipeline",
      overview: [
        "The goal was to reduce repetitive manual work in facial animation authoring while preserving expressive control for production artists. The pipeline linked speech-to-viseme estimation with sentiment-aware expression generation so dialogue could be translated into animation more consistently.",
        "From a systems perspective, the work combined signal processing, multivariate prediction, and lightweight sentiment analysis into a practical content workflow. It was designed as a deployable production tool rather than a standalone research demo.",
      ],
      mediaLinks: [
        {
          href: "https://youtu.be/VZ4Cizmscx0",
          label: "watch on YouTube",
        },
      ],
    },
  },
  {
    slug: "neural-audio-filter",
    title: "Neural Audio Filter for Transforming Monster Voices into Machinery Sounds",
    venue: "Neowiz, Jun 2021 - Oct 2022",
    cardDescription:
      "Conducted GAN-based domain transfer to convert monster voices into mechanical sounds; applied in Lies of P.",
    cardImage: {
      src: "images/PnP/PnP_Neural_Filter.png",
      alt: "Neural audio filter",
    },
    cardLinks: [{ href: "https://youtu.be/QqUCyK8s5wA", label: "video" }],
    detail: {
      metaDescription:
        "Project detail page for neural audio filtering for stylized creature voice transformation by Jin-Hyeong Park.",
      intro:
        "This project explored neural audio transformation for converting monster-like vocal performances into machine-like sounds suitable for game production.",
      organization: "Neowiz",
      period: "Jun 2021 - Oct 2022",
      keywords: "Neural representation, signal processing, GAN-based style transfer",
      heroImage: "images/PnP/PnP_Neural_Filter.png",
      heroAlt: "Neural audio filter",
      overview: [
        "The production need was to create convincing mechanical creature voices without relying entirely on handcrafted sound design for every variant. The project framed this as a domain transfer problem between organic vocal inputs and stylized machinery-like outputs.",
        "The resulting system used GAN-based style transfer ideas and signal processing considerations to create a practical transformation pipeline. The work was applied in the production context of Lies of P, where consistency, speed, and artistic usability mattered as much as raw novelty.",
      ],
      mediaLinks: [
        {
          href: "https://youtu.be/QqUCyK8s5wA",
          label: "watch on YouTube",
        },
      ],
    },
  },
  {
    title: "Development of Computer based Three-Dimensional Medical Image Analysis Program for the Objective Assessment of Orbital Disease",
    venue: "National Research Foundation of Korea, Sep 2018 - Oct 2019",
    cardDescription:
      "Conducted 3D volumetric data classification using 3D convolutional neural networks, achieving high accuracy in multi-class prediction tasks.",
    cardImage: {
      src: "images/PnP/PnP_Medical_Image.png",
      alt: "3D medical image analysis project",
    },
  },
]
