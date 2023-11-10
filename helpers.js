// Función de ayuda para calcular el MCM de dos números
function calcularMCM(a, b) {
    // Utiliza el algoritmo de Euclides para encontrar el máximo común divisor (MCD)
    function encontrarMCD(x, y) {
        if (y === 0) return x;
        return encontrarMCD(y, x % y);
    }

    // Calcula el MCM utilizando la fórmula MCM(a, b) = (a * b) / MCD(a, b)
    return (a * b) / encontrarMCD(a, b);
}

module.exports = {
    calcularMCM
}
