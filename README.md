# coffeedrop

https://aqua-lzma.github.io/coffeedrop

Milkdrop sans music in WebGL

## Editing guide

Heres a brief description of each shader / layer / framebuffer / texture.

### Composite

The output of this layer is what is show to the viewer. This is the last one to be rendered per frame. It can read from basically every other layer down the pipeline.

### Warp

There are two textures / framebuffers in this layer that swap each frame. That way it recieves itself as an input. It can also read from basically every other layer.

### Init

This layer is rendered only once at the start and fed to warp as if it was warps last frame.

### Blur

These layer run right after warp and before composite, blurring the output of the just rendered warp layer.

### Perlin

Perlin noise layer, has 4 individual noise gradient fields when sampled (rgba).

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
