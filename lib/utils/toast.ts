import { Icons } from "@/components/views/SvgView.vue";
import { ref } from "vue";


export class Toast {
   
    public toastList = ref(new Map<number, iToast>());

    public clearAll() {
        this.toastList.value.clear();
    }

    public addToast(message: string,title: string = '',  icon: string = 'info', duration: number = 3000) {
        let date = Date.now();
        if (this.toastList.value.has(date)) {
            date++;
        }
        const iconMap: { [key: string]: string } = {
            'warning': Icons.add,
            'error': Icons.cinema,
            'check': Icons.check
        };

        icon = iconMap[icon] || Icons.info;
        this.toastList.value.set(date, { message, icon, title });
        duration = duration < 0 ? 2500 : duration;
        setTimeout(() => {
            this.toastList.value.delete(date);
        }, duration);
    }

    private static instance: Toast;
    public static getInstance(): Toast {
        if (Toast.instance == null) {
            Toast.instance = new Toast();
        }
        return <Toast>Toast.instance;
    }
}

interface iToast {
    title: string,
    message: string,
    icon: string
}
