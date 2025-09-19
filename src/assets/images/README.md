# 📁 Estrutura de Imagens - AllTurismo Admin

## **Organização das Pastas**

```
src/assets/images/
├── logo/           # Logos da marca (SVG, PNG)
├── icons/          # Ícones do sistema (SVG, PNG)
├── backgrounds/    # Imagens de fundo
├── products/       # Imagens de produtos/estabelecimentos
└── banners/        # Banners promocionais
```

## **📋 Convenções de Nomenclatura**

            ### **Logos**
            - `logo-primary.svg` - Logo principal (SVG)
            - `logo5.png` - Logo principal (PNG) - **ATUAL**
            - `logo-white.png` - Logo em branco
            - `logo-dark.png` - Logo escuro
            - `favicon.ico` - Favicon do site

### **Ícones**
- `icon-{nome}.svg` - Ícones SVG
- `icon-{nome}-{tamanho}.png` - Ícones PNG

### **Produtos**
- `product-{id}.jpg` - Imagens de produtos
- `establishment-{id}.jpg` - Imagens de estabelecimentos

### **Banners**
- `banner-{tipo}-{id}.jpg` - Banners promocionais

## **🎯 Formatos Recomendados**

### **SVG** (Recomendado para ícones e logos)
- ✅ Escalável sem perda de qualidade
- ✅ Menor tamanho de arquivo
- ✅ Editável via CSS

### **PNG** (Para logos e ícones complexos)
- ✅ Suporte a transparência
- ✅ Boa qualidade

### **JPG/JPEG** (Para fotos e imagens complexas)
- ✅ Menor tamanho de arquivo
- ✅ Boa para fotos

### **WebP** (Moderno e eficiente)
- ✅ Melhor compressão
- ✅ Suporte crescente

## **📝 Como Usar no Angular**

### **No Template HTML:**
```html
<img src="assets/images/logo/logo2.png" alt="AllTurismo Logo">
```

### **No CSS/SCSS:**
```scss
.logo {
  background-image: url('/assets/images/logo/logo-primary.svg');
}
```

### **No TypeScript:**
```typescript
const logoPath = 'assets/images/logo/logo-primary.svg';
```

## **⚡ Otimizações**

1. **Compressão**: Use ferramentas como TinyPNG
2. **Lazy Loading**: Carregue imagens conforme necessário
3. **Responsive Images**: Use diferentes tamanhos para diferentes telas
4. **CDN**: Considere usar CDN para imagens grandes

## **🔧 Ferramentas Úteis**

- **TinyPNG**: Compressão de imagens
- **SVGOMG**: Otimização de SVGs
- **Squoosh**: Compressão avançada do Google
- **ImageOptim**: Otimização para Mac
