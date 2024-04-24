<h1 align="center">UForm</h1>
<h3 align="center">
Pocket-Sized Multimodal AI<br/>
For Content Understanding and Generation<br/>
</h3>
<br/>

<p align="center">
<a href="https://discord.gg/jsMURnSFM2"><img height="25" src="https://github.com/unum-cloud/.github/raw/main/assets/discord.svg" alt="Discord"></a>
&nbsp; &nbsp; &nbsp;
<a href="https://www.linkedin.com/company/unum-cloud/"><img height="25" src="https://github.com/unum-cloud/.github/raw/main/assets/linkedin.svg" alt="LinkedIn"></a>
&nbsp; &nbsp; &nbsp;
<a href="https://twitter.com/unum_cloud"><img height="25" src="https://github.com/unum-cloud/.github/raw/main/assets/twitter.svg" alt="Twitter"></a>
&nbsp; &nbsp; &nbsp;
<a href="https://unum.cloud/post"><img height="25" src="https://github.com/unum-cloud/.github/raw/main/assets/blog.svg" alt="Blog"></a>
&nbsp; &nbsp; &nbsp;
<a href="https://github.com/unum-cloud/uform"><img height="25" src="https://github.com/unum-cloud/.github/raw/main/assets/github.svg" alt="GitHub"></a>
</p>

<p align="center">
Multimodal Embeddings from 64 to 768 Dimensions • 1B Parameter Chat
<br/>
Short Texts • Images • 🔜 Video Clips • 🔜 Long Documents
<br/>
ONNX • CoreML • PyTorch
<br/>
<a href="https://github.com/unum-cloud/uform/blob/main/python/README.md">Python</a>
 • 
<a href="https://github.com/unum-cloud/uform/blob/main/javascript/README.md">JavaScript</a>
 • 
<a href="https://github.com/unum-cloud/uform/blob/main/swift/README.md">Swift</a>
</p>

---

![UForm Chat Preview](https://github.com/ashvardanian/usearch-images/blob/main/assets/uform-gen-preview.jpg?raw=true)

Welcome to UForm, a __multimodal__ AI library that's as versatile as it is efficient.
UForm [tiny embedding models](#encoder) will help you understand and search visual and textual content across various languages.
UForm [small generative models](#decoder), on the other hand, don't only support conversational and chat use-cases, but are great for fast image captioning and Visual Question Answering (VQA).
With compact __custom pre-trained transformer models__, this can run anywhere from your server farm down to your smartphone.

## Features

- __Tiny Embeddings__: 64-dimensional [Matryoshaka][matryoshka]-style embeddings for extremely fast [search][usearch].
- __Throughput__: Thanks to the small size, the inference speed is [2-4x faster](#speed) than competitors.
- __Portable__: Models come with native ONNX support, making them easy to deploy on any platform.
- __Quantization Aware__: Down-cast embeddings from `f32` to `i8` without losing much recall.
- __Multilingual__: Trained on a balanced dataset, the recall is great across over 20 languages.

[usearch]: https://github.com/unum-cloud/usearch
[matryoshka]: https://arxiv.org/abs/2205.13147

## Models

For accuracy and speed benchmarks refer to the [evaluation page](https://github.com/unum-cloud/uform/blob/main/BENCHMARKS.md).

### Embedding Models

| Model                                               | Parameters | Languages |                                 Architecture |
| :-------------------------------------------------- | ---------: | --------: | -------------------------------------------: |
| [`uform3-image-text-english-large`][model-e-l] 🆕    |       365M |         1 | 6 text layers, ViT-L/14, 6 multimodal layers |
| [`uform3-image-text-english-base`][model-e]         |       143M |         1 | 2 text layers, ViT-B/16, 2 multimodal layers |
| [`uform3-image-text-english-small`][model-e-s] 🆕    |        79M |         1 | 2 text layers, ViT-S/16, 2 multimodal layers |
| [`uform3-image-text-multilingual-base`][model-m-v2] |       206M |        21 | 8 text layers, ViT-B/16, 4 multimodal layers |

[model-e-l]: https://huggingface.co/unum-cloud/uform-vl-english-large/
[model-e]: https://huggingface.co/unum-cloud/uform-vl-english/
[model-e-s]: https://huggingface.co/unum-cloud/uform-vl-english-small/
[model-m]: https://huggingface.co/unum-cloud/uform-vl-multilingual/
[model-m-v2]: https://huggingface.co/unum-cloud/uform-vl-multilingual-v2/

### Generative Models

| Model                              | Parameters |                     Purpose |           Architecture |
| :--------------------------------- | ---------: | --------------------------: | ---------------------: |
| [`uform-gen2-dpo`][model-g2] 🆕     |       1.2B | Chat, Image Captioning, VQA | qwen1.5-0.5B, ViT-H/14 |
| [`uform-gen2-qwen-500m`][model-g2] |       1.2B | Chat, Image Captioning, VQA | qwen1.5-0.5B, ViT-H/14 |
| [`uform-gen`][model-g1]            |       1.5B |       Image Captioning, VQA |   llama-1.3B, ViT-B/16 |

[model-g2]: https://huggingface.co/unum-cloud/uform-gen2-qwen-500m/
[model-g1]: https://huggingface.co/unum-cloud/uform-gen/

## Features and Recommendations

### Down-casting, Quantization, Matryoshka, and Slicing

Depending on the application, the embeddings can be down-casted to smaller numeric representations without losing much recall.
Switching from `f32` to `f16` is recommended in almost all cases, unless you are running on very old hardware without half-precision support.
Switching to `i8` with linear scaling is also possible, but will be noticeable in the recall on larger collections with millions of searchable entries.
Similarly, for higher-dimensional embeddings (512 or 768), a common strategy is to quantize them into single-bit representations for faster search.

```python
import numpy as np

f32_embedding: np.ndarray = model.encode_text(text_data, return_features=False)
f16_embedding: np.ndarray = f32_embedding.astype(np.float16)
i8_embedding: np.ndarray = (f32_embedding * 127).astype(np.int8)
b1_embedding: np.ndarray = np.packbits((f32_embedding > 0).astype(np.uint8))
```

Alternative approach to quantization is to use the Matryoshka embeddings, where the embeddings are sliced into smaller parts, and the search is performed in a hierarchical manner.

```python
import numpy as np

large_embedding: np.ndarray = model.encode_text(text_data, return_features=False)
small_embedding: np.ndarray = large_embedding[:, :256]
tiny_embedding: np.ndarray = large_embedding[:, :64]
```

Both approaches are natively supported by the [USearch][github-usearch] vector-search engine and the [SimSIMD][github-simsimd] numerics libraries.
When dealing with small collections (up to millions of entries) and looking for low-latency cosine distance calculations, you can [achieve 5x-2500x performance improvement][report-simsimd] over Torch, NumPy, SciPy, and vanilla Python using SimSIMD.

```python
from simsimd import cosine, hamming

distance: float = cosine(f32_embedding, f32_embedding) # 32x SciPy performance on Apple M2 CPU
distance: float = cosine(f16_embedding, f16_embedding) # 79x SciPy performance on Apple M2 CPU
distance: float = cosine(i8_embedding, i8_embedding) # 133x SciPy performance on Apple M2 CPU
distance: float = hamming(b1_embedding, b1_embedding) # 17x SciPy performance on Apple M2 CPU
```

Similarly, when dealing with large collections (up to billions of entries per server) and looking for high-throughput search, you can [achieve 100x performance improvement][report-usearch] over FAISS and other vector-search solutions using USearch.
Here are a couple of examples:

```python
from usearch.index import Index

f32_index = Index(ndim=64, metric='cos', dtype='f32') # for Matryoshka embeddings
f16_index = Index(ndim=64, metric='cos', dtype='f16') # for Matryoshka embeddings
i8_index = Index(ndim=256, metric='cos', dtype='i8') # for quantized embeddings
b1_index = Index(ndim=768, metric='hamming', dtype='b1') # for binary embeddings
```

[github-usearch]: https://github.com/unum-cloud/usearch
[github-simsimd]: https://github.com/ashvardanian/simsimd
[report-usearch]: https://www.unum.cloud/blog/2023-11-07-scaling-vector-search-with-intel
[report-simsimd]: https://ashvardanian.com/posts/python-c-assembly-comparison/

### Compact Packaging

PyTorch is a heavy dependency to carry, especially if you run on Edge or IoT devices.
Using vanilla ONNX runtime, one can significantly reduce memory consumption and deployment latency.

```sh
$ conda create -n uform_torch python=3.10 -y
$ conda create -n uform_onnx python=3.10 -y
$ conda activate uform_torch && pip install -e ".[torch]" && conda deactivate
$ conda activate uform_onnx && pip install -e ".[onnx]" && conda deactivate
$ du -sh $(conda info --envs | grep 'uform_torch' | awk '{print $2}')
> 5.2G    ~/conda/envs/uform_torch
$ du -sh $(conda info --envs | grep 'uform_onnx' | awk '{print $2}')
> 461M    ~/conda/envs/uform_onnx
```

Most of that weight can be further reduced down to 100 MB for both the model and the runtime.
You can pick one of many supported [ONNX execution providers][onnx-providers], which includes XNNPACK, CUDA and TensorRT for Nvidia GPUs, OpenVINO on Intel, DirectML on Windows, ROCm on AMD, CoreML on Apple devices, and more to come.

[onnx-providers]: https://onnxruntime.ai/docs/execution-providers/

### Multimodal Chat in CLI

The generative models can be used for chat-like experiences in the command line.
For that, you can use the `uform-chat` CLI tool, which is available in the UForm package.

```bash
$ pip install uform
$ uform-chat --model unum-cloud/uform-gen2-dpo --image=zebra.jpg
$ uform-chat --model unum-cloud/uform-gen2-dpo \
>     --image="https://bit.ly/3tIVg9M" \
>     --device="cuda:0" \
>     --fp16
```
