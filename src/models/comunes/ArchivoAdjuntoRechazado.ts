export interface ObjArchivoRechazado { // Crearemos un array para guardar los archivos que se adjunten, invalidos, para poder mapearlos en la interfaz. 
    fileData: File; // El array tendra un objeto en cada elemento, con 2 datos, el archivo y el mensaje de error
    msjError: string;
}


