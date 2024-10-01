# [CoffeeDrop](https://aqua-lzma.github.io/coffeedrop)
Milkdrop sans music in WebGL

## Layers
Here's a brief description of each shader / layer / framebuffer / texture available.

- **Composite**: The output of this layer is what is shown to the viewer. This is the last layer to be rendered per frame. It can read from almost every other layer in the pipeline.
- **Warp**: This layer contains two textures/framebuffers that swap each frame, allowing it to receive itself as an input. It can also read from almost every other layer.
- **Init**: This layer is rendered only once at the start and is fed to the Warp layer as if it were the last frame of Warp.
- **Blur**: This layer runs right after Warp and before Composite, blurring the output of the just-rendered Warp layer.
- **Perlin**: This layer generates Perlin noise and has 4 individual noise gradient fields when sampled (RGBA).

## Pipeline graph
```
                            ┌─────────────┐                            
                            │   Display   │                            
                            └─────────────┘                            
                                   ▲                                   
                                   │                                   
                            ┌──────┴──────┐                            
       ┌───────────────────►│  Composite  │◄───────────────────┐       
       │                    └─────────────┘                    │       
       │                           ▲                           │       
       │                           │                           │       
       │          ┌────────────────┴────────────────┐          │       
┌──────┴──────┐   │┌─────────────┬──►┌─────────────┐├──►┌──────┴──────┐
│   Perlin    ├──►││    Warp0    │   │    Warp1    ││   │Blur(1, 2, 3)│
└─────────────┘   │└─────────────┘◄──┴─────────────┘│◄──┴─────────────┘
                  └─────────────────────────────────┘                  
                                   ▲                                   
                                   │                                   
                            ┌──────┴──────┐                            
                            │    Init     │                            
                            └─────────────┘                            
```
