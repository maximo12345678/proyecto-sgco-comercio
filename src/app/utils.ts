export function extractFilenameAndType(file: File) {
  const filename = file.name.split('.')[0];
  const file_type = file.type.split('/')[1];
  return { name: filename, file_type: file_type };
}

export const readFileAsync = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString().split(',')[1]);
      } else {
        reject(new Error('Empty file'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function  formatearMonto(monto: string) {
    let convertido = parseInt(monto, 10); // Convierte el string a número entero
    return convertido.toLocaleString('es-ES'); // Utiliza la configuración regional para separar los miles
  }
