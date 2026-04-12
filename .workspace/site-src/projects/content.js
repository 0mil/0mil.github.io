export const projects = [
  {
    slug: "game-image-generation",
    title: "IP-Consistent Generative Image Service for Multi-Project Game Art Production",
    venue: "Neowiz, Jan 2024 - Present",
    cardDescription:
      "An internal generative image service for controllable, title-specific artwork creation across multiple game projects.",
    cardImage: {
      src: "images/PnP/Pnp_Image_Generation_Serive.png",
      alt: "Game image generation AI service project",
    },
    detail: {
      metaDescription:
        "Project detail page for an IP-consistent generative image service for multi-project game art production by Jin-Hyeong Park.",
      intro:
        "This project focused on building and operating an internal generative image service for multiple game teams with distinct visual styles and production needs.",
      organization: "Neowiz",
      period: "Jan 2024 - Present",
      keywords: "Generative models, image processing, IP-consistent generation",
      heroImage: "images/PnP/Pnp_Image_Generation_Serive.png",
      heroAlt: "IP-consistent generative image service project",
      quote:
        "An internal AI service for controllable, title-specific image generation across diverse game art workflows.",
      overview: [
        "This project focused on building and operating an internal generative image service for multiple game teams with distinct visual styles and production needs. Rather than supporting a single image-generation task, the service was designed to cover a broad range of artist workflows, including concept ideation, sketch completion, style transfer from real-world references, turnaround illustration, and multi-view drawing generation for downstream 3D production.",
        "The central challenge was not simply generating high-quality images, but doing so in a way that remained consistent with each title's art direction and reliable enough for repeated use in production.",
      ],
      sections: [
        {
          label: "Approach",
          paragraphs: [
            "I developed task-specific ComfyUI workflows and continuously updated them as the field evolved, integrating new controllable generation methods for structure guidance, identity preservation, style adaptation, layered composition, and reusable editing pipelines.",
            "The service was shaped through direct iteration with artists across seven internal IPs over more than two years, which meant balancing visual quality against practical concerns such as repeatability, consistency, latency, and ease of use.",
            "Instead of treating new models and papers as isolated experiments, I evaluated and incorporated them as modular components within a production-oriented system for IP-constrained image generation.",
          ],
        },
        {
          label: "Key Contributions",
          items: [
            "Built and operated an internal generative image service that supported multiple art-production tasks under title-specific style constraints.",
            "Designed and refined task-specific workflows by integrating controllable generation techniques for structure guidance, identity preservation, style adaptation, and iterative editing.",
            "Worked directly with artists across seven internal IPs to improve workflow usability and reduce repetitive reference-sharing and iteration overhead in daily production.",
          ],
        },
        {
          label: "Outcome",
          paragraphs: [
            "The service was adopted across seven internal game projects over more than two years, including support for a Google Play-recognized mobile title that exceeded 80 million downloads.",
            "Internal artist feedback indicated that, for some workflows, the system substantially reduced repetitive sharing of prior references and visual examples, with one interview estimating roughly a 60% reduction.",
            "More broadly, this project showed that the practical value of generative models in game art production depends less on raw model novelty and more on whether they can be made controllable, consistent, and reliable enough for real artist workflows.",
          ],
        },
        {
          label: "Technical Takeaway",
          paragraphs: [
            "In production art pipelines, the hardest problem is rarely image generation itself; it is building a controllable and IP-consistent system that remains useful across heterogeneous tasks, evolving models, and real artist workflows.",
          ],
        },
      ],
      mediaLinks: [],
    },
  },  {
    slug: "hair-guide",
    title: "Automated Hair Guide Model Generation for Game Characters from 3D Reconstruction",
    venue: "Neowiz, Apr 2024 - Nov 2024",
    cardDescription:
      "A production-oriented pipeline for converting dense reconstructed hair into editable guide-hair models.",
    cardImage: {
      src: "images/PnP/Pnp_Hair_Modeling.png",
      alt: "Hair guide model generation",
    },
    detail: {
      metaDescription:
        "Project detail page for automated hair guide model generation from 3D reconstruction by Jin-Hyeong Park.",
      intro:
        "This project investigated how to convert high-fidelity 3D hair reconstruction into a representation that artists could actually use for game asset production.",
      organization: "Neowiz",
      period: "Apr 2024 - Nov 2024",
      keywords: "3D content generation, geometry processing, inverse rendering",
      heroImage: "images/PnP/Pnp_Hair_Modeling.png",
      heroAlt: "Hair guide model generation pipeline",
      quote:
        "A pilot study on turning high-fidelity hair reconstruction into a production-usable guide-hair pipeline.",
      overviewFigures: [
        {
          src: "images/projects/auto-hair-guide-gen/overview-figure.png",
          alt: "Hair guide pipeline overview",
        },
      ],
      overview: [
        "This project investigated how to convert high-fidelity 3D hair reconstruction into a representation that artists could actually use for game asset production. Starting from a monocular-video hair reconstruction workflow based on recent research, the system produced dense strand geometry that preserved hairstyle detail well, but the raw output was too heavy and irregular for direct use in Maya or Unreal.",
        "I therefore designed a post-processing pipeline that distilled reconstructed strands into a sparse guide-hair model while preserving the overall silhouette, flow, and style of the original hair.",
      ],
      sections: [
        {
          label: "Approach",
          figures: [
            {
              src: "images/projects/auto-hair-guide-gen/approach-figure.png",
              alt: "Guide hair modeling pipeline",
            },
          ],
          paragraphs: [
            "The front end reconstructed dense 3D hair from video and converted it into strand-level geometry. I then applied geometry processing in four stages: strand cleanup and normalization, feature extraction, clustering by spatial and directional behavior, and representative-strand selection followed by control-point reduction.",
            "In practice, this meant aligning strands into a comparable form, encoding features such as root position, dominant direction, length, and waviness, grouping strands with similar geometric behavior, and selecting representative strands before simplifying them through resampling.",
            "This allowed the final guide set to remain lightweight without collapsing the hairstyle into an over-smoothed approximation.",
          ],
        },
        {
          label: "Key Contributions",
          items: [
            "Adapted a research-grade monocular hair reconstruction workflow into a production-oriented pipeline for guide-hair generation.",
            "Designed a geometry-processing stage that combined strand normalization, clustering, representative-strand selection, and resampling to compress dense reconstructions into editable guide sets.",
            "Reduced strand complexity and control-point count while preserving the major volume, silhouette, and directional structure needed for downstream artist workflows.",
          ],
        },
        {
          label: "Outcome",
          figures: [
            {
              src: "images/projects/auto-hair-guide-gen/result-fig1.png",
              alt: "Final guide hair result figure 1",
            },
            {
              src: "images/projects/auto-hair-guide-gen/result-fig2.png",
              alt: "Final guide hair result figure 2",
            },
          ],
          figureLayout: "equal",
          paragraphs: [
            "This project reframed recent hair reconstruction research as a pipeline design problem rather than a pure reconstruction benchmark. The resulting workflow preserved the major hairstyle shape and directional structure while lowering strand and control-point complexity, making the output more practical as an intermediate asset for grooming and game-character production.",
            "As a pilot study, it established a feasible path from high-fidelity reconstruction to artist-usable guide-hair generation.",
          ],
        },
        {
          label: "Technical Takeaway",
          paragraphs: [
            "For production hair assets, the bottleneck is often not reconstruction fidelity itself, but how effectively dense reconstructed strands can be compressed into a sparse, controllable guide structure without losing silhouette and flow.",
          ],
        },
      ],
      mediaLinks: [],
    },
  },  {
    slug: "lip-sync-emotion",
    title: "Development of Facial Animation Pipeline for Lip Sync and Emotion Based on Voice and Script",
    venue: "Neowiz, Aug 2022 - Oct 2022",
    cardDescription:
      "An automated facial animation pipeline that generated lip-sync and emotional expressions from voice and dialogue scripts.",
    cardImage: {
      src: "images/PnP/PnP_Lip_Sync.png",
      alt: "Lip sync and emotion pipeline",
    },
    cardLinks: [{ href: "https://youtu.be/VZ4Cizmscx0", label: "video" }],
    detail: {
      metaDescription:
        "Project detail page for facial animation pipeline development for lip sync and emotion based on voice and script by Jin-Hyeong Park.",
      intro:
        "This project focused on automating facial animation for cartoon-style game characters from voice and script inputs.",
      organization: "Neowiz",
      period: "Aug 2022 - Oct 2022",
      keywords: "Signal processing, multivariate prediction, sentiment analysis",
      heroVideo: {
        src: "video/Lip%20Sync.mp4",
        type: "video/mp4",
      },
      heroAlt: "Lip sync and emotion pipeline video",
      quote:
        "An automated facial animation pipeline for generating lip sync and emotional expressions from speech and dialogue text.",
      overview: [
        "This project focused on automating facial animation for cartoon-style game characters from voice and script inputs. The core challenge was that convincing dialogue animation requires two different signals at once: precise mouth motion for lip sync and broader facial expressions that reflect the emotional tone of the line.",
        "Manual keyframing could achieve this, but it was expensive and difficult to scale across dialogue-heavy content. I therefore designed a pipeline that analyzed vocal audio in the spectral domain to drive lip motion and used script-level sentiment cues to modulate facial expressions, producing rig-compatible animation controls automatically.",
      ],
      sections: [
        {
          label: "Approach",
          paragraphs: [
            "The audio branch converted speech into frame-synchronous acoustic features and used a temporal prediction model to estimate blendshape weights corresponding to viseme-related mouth movements over time.",
            "Rather than predicting a full facial mesh directly, the system was designed around the existing facial rig, which made the output easier to integrate into character animation workflows.",
            "In parallel, the text branch analyzed the dialogue script to estimate coarse emotional tone and expression intensity, which was then mapped to upper-face and expression-related controls such as brows, eyes, and cheek movement. The two branches were fused and post-processed with temporal smoothing and rule-based constraints so that the final animation remained stable, readable, and suitable for stylized in-game characters.",
          ],
        },
        {
          label: "Key Contributions",
          items: [
            "Designed an automated pipeline that generated rig-compatible facial animation controls from both voice and dialogue text.",
            "Built a speech-driven lip-sync stage that mapped spectral and temporal speech features to time-varying blendshape weights for viseme-related mouth motion.",
            "Added a script-based sentiment branch to modulate expression-related facial controls, allowing lip sync and emotional expression to be generated together rather than as separate manual steps.",
          ],
        },
        {
          label: "Outcome",
          paragraphs: [
            "This project reframed facial animation as a multimodal prediction problem rather than a purely manual animation task. The resulting pipeline automated a significant portion of dialogue-driven facial motion generation and provided a practical bridge between speech processing and stylized character animation.",
            "As a pilot production tool, it showed that combining fast audio-driven mouth motion with slower text-guided emotional modulation could produce facial performances that were both more scalable and more expressive than lip sync alone.",
          ],
        },
        {
          label: "Technical Takeaway",
          paragraphs: [
            "Believable facial animation depends on separating fast phoneme-driven mouth motion from slower utterance-level emotional modulation, then recombining them into a temporally stable rig-control signal.",
          ],
        },
      ],
      mediaLinks: [],
    },
  },  {
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
        "Project detail page for neural audio style transfer for mechanical creature voice design in Lies of P by Jin-Hyeong Park.",
      intro:
        "This project explored neural audio style transfer for generating machine-like creature voices for Lies of P while preserving the original performance cues that made them feel alive.",
      organization: "Neowiz",
      period: "Jun 2021 - Oct 2022",
      keywords: "Neural representation, signal processing, GAN-based style transfer",
      heroVideo: {
        src: "video/Neural%20Audio%20Filter.mp4",
        type: "video/mp4",
      },
      heroAlt: "Neural audio filter video",
      quote:
        "A neural audio style transfer project for generating machine-like creature voices for Lies of P.",
      overviewFigures: [
        {
          src: "images/projects/neural-audio-filter/overview-figure.png",
          alt: "Neural audio filter overview figure",
        },
      ],
      overview: [
        "This project explored neural audio style transfer for designing mechanical creature voices in the world of Lies of P. The central challenge was that the monsters were intended to sound machine-like rather than organic, yet raw mechanical recordings lacked the timing, force, and expressive motion needed for believable creature performances.",
        "Instead of relying only on conventional sound design techniques such as filtering, layering, and manual editing, I developed a neural audio filter that transformed monster vocal samples into mechanical textures while retaining the original performance cues that made them feel alive.",
      ],
      sections: [
        {
          label: "Approach",
          figures: [
            {
              src: "images/projects/neural-audio-filter/approach-figure-combined.png",
              alt: "Neural audio filter approach figure",
            },
          ],
          paragraphs: [
            "The system was built on a non-parallel spectrogram-based audio translation framework and adapted for game audio rather than standard voice conversion.",
            "My main focus was not simply transferring texture, but preserving the dynamics and accent structure of the source signal so that the output would still feel like an intentional creature performance rather than a layer of generic machine noise.",
            "To support broader artistic variation, I also organized the reference mechanical sound library into a small number of stylistic groups, allowing the team to explore multiple output directions with different machine-like characteristics.",
          ],
        },
        {
          label: "Key Contributions",
          items: [
            "Adapted a non-parallel spectrogram translation approach for mechanical creature sound design in a production setting.",
            "Modified the training objective to better preserve the temporal dynamics and expressive contour of the original vocal input during style transfer.",
            "Structured the reference sound library into multiple stylistic clusters to generate different categories of mechanical sound candidates rather than a single uniform output.",
          ],
        },
        {
          label: "Outcome",
          paragraphs: [
            "This project turned a difficult manual sound design problem into a reusable generative tool for creating stylized sound samples.",
            "The generated outputs were used as candidate assets within the audio production workflow of Lies of P, helping the team produce mechanical creature sounds more efficiently while maintaining consistency with the game's worldbuilding and tone.",
          ],
        },
        {
          label: "Technical Takeaway",
          paragraphs: [
            "A key lesson from this project was that perceptually convincing audio transfer depended less on matching surface texture alone and more on preserving the motion and expressive structure of the original source signal.",
          ],
        },
      ],
      mediaLinks: [],
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





