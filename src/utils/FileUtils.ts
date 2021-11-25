export class FileUtils {
  static getBase64ByFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  static async getBase64ByFileForJava(file: File) {
    const base64 = await FileUtils.getBase64ByFile(file);
    return base64.split(",")[1];
  }

  static async mapFilesToFilesRequest(files: File[]) {
    const filesRequest = [];
    let fileRequest;
    for (const file of files) {
      const { name, size, type } = file;
      const base64 = await FileUtils.getBase64ByFileForJava(file);
      fileRequest = { name, size, type, base64 };
      filesRequest.push(fileRequest);
    }

    return filesRequest;
  }

  static download(bytes: any, fileName: string, extension: string | null = null): void {
    const name = extension ? fileName + "." + extension : fileName;
    const url = window.URL.createObjectURL(new Blob([bytes]));
    FileUtils.downloadByUrl(url, name, extension);
  }

  static downloadByUrl(url: string, fileName: string, extension: string | null = null): void {
    const name = extension ? fileName + "." + extension : fileName;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    link.click();
  }

  static getBase64ByBlob(blob: any) {

  }
}
