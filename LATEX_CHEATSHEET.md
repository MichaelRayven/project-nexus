# Краткое руководство по LaTeX

## 1. Основы написания формул

### Встроенная формула:

`$a^2 + b^2 = c^2$`

### Блочная формула:

```latex
$$
a^2 + b^2 = c^2
$$
```

## 2. Индексы и степени

```latex
x_i       нижний индекс: xᵢ
x_{ij}    сложный индекс: xᵢⱼ
x^2       верхний индекс: x²
x^{10}    сложная степень: x¹⁰
```

## 3. Греческие буквы

```latex
\alpha  \beta  \gamma  \delta
\epsilon  \zeta  \eta  \theta
\lambda  \mu  \pi  \sigma
\phi  \psi  \omega
```

Прописные: `\Gamma \Delta \Theta \Lambda \Pi \Sigma \Phi \Psi \Omega`

## 4. Дроби

```latex
\frac{a}{b}        a/b
\tfrac{a}{b}       компактная дробь (встроенная)
\dfrac{a}{b}       увеличенная дробь (в блоке)
```

## 5. Корни

```latex
\sqrt{x}           √x
\sqrt[n]{x}        корень n-й степени
```

## 6. Скобки и их автоматический размер

```latex
(x+y)                        обычные скобки
\left( \frac{a}{b} \right)   скобки под размер дроби
\left[ x \right]             квадратные
\left\{ x \right\}           фигурные
```

#### Рендер:

$$(x+y)$$
$$\left( \frac{a}{b} \right)$$
$$\left[ x \right]$$
$$\left\{ x \right\}$$

## 7. Суммы, произведения, интегралы

```latex
\sum_{i=1}^n i^2
\prod_{k=1}^n k
\int_{0}^{\infty} e^{-x} dx
\iint\limits_{D} f(x,y) dx dy
```

#### Рендер:

$$\sum_{i=1}^n i^2$$
$$\prod_{k=1}^n k$$
$$\int_{0}^{\infty} e^{-x} dx$$
$$\iint\limits_{D} f(x,y) dx dy$$

## 8. Матричные структуры

```latex
\begin{matrix}
1 & 2 \\
3 & 4
\end{matrix}

\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}

\begin{bmatrix}
1 & 0 \\
0 & 1
\end{bmatrix}
```

#### Рендер:

$$
\begin{matrix}
1 & 2 \\
3 & 4
\end{matrix}
$$  
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$
$$
\begin{bmatrix}
1 & 0 \\
0 & 1
\end{bmatrix}
$$

## 9. Специальные символы

```latex
\infty        ∞
\pm           ±
\cdot         ⋅
\times        ×
\div          ÷
\to           →
\Rightarrow   ⇒
\approx       ≈
\neq          ≠
\leq          ≤
\geq          ≥
\forall       ∀
\exists       ∃
\partial      ∂
```

## 10. Форматирование внутри формул

```latex
\text{текст}             текст внутри формулы
\mathbf{A}               жирный
\mathit{A}               курсив
\mathbb{R}               ℝ (множество)
\mathcal{L}              каллиграфический L
```

#### Рендер:

$\text{текст}$  
$\mathbf{A}$  
$\mathit{A}$  
$\mathbb{R}$  
$\mathcal{L}$  

## 11. Примеры

```latex
Квадратное уравнение
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}

Ряд Тейлора
e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!}

Интеграл Гаусса
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
```

#### Рендер:

Квадратное уравнение  
$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

Ряд Тейлора  
$e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!}$

Интеграл Гаусса  
$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$
