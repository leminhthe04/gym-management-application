import api from "@/lib/axios";

export const kioskService = {

  registerMember: async (formData: FormData) => {

    console.log("POST RESGISTER MEMBER")
    const response = await api.post("/members/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  dataURL2Blob: (dataURL: string): Blob => {
    
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime }); 
  }
};
