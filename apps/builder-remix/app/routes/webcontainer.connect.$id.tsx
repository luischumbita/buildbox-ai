import { useEffect, useState } from "react";

export default function WebcontainerConnectRoute() {
    const [status, setStatus] = useState<"connecting" | "ok" | "error">(
        "connecting"
    );
    const [message, setMessage] = useState<string>(
        "Conectando pestaña al proyecto..."
    );

    useEffect(() => {
        (async () => {
            try {
                const apiMod: any = await import("@webcontainer/api");
                const WebContainer = apiMod.WebContainer || apiMod.default || apiMod;
                const doConnect =
                    typeof apiMod.connect === "function"
                        ? apiMod.connect
                        : typeof WebContainer?.connect === "function"
                            ? WebContainer.connect
                            : null;
                if (!doConnect) throw new Error("No connect function available");
                await doConnect();
                setStatus("ok");
                setMessage(
                    "Conexión establecida. Vuelve a la pestaña del preview (se recargará automáticamente)."
                );
                // Intenta cerrar esta pestaña/ventana si fue abierta por el preview
                setTimeout(() => {
                    window.close();
                }, 1500);
            } catch (err) {
                setStatus("error");
                setMessage(
                    "No se pudo conectar esta pestaña al proyecto. Recarga e inténtalo nuevamente."
                );
                // eslint-disable-next-line no-console
                console.error("WebContainer connect error", err);
            }
        })();
    }, []);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}>
            <div style={{ maxWidth: 640, padding: 24, textAlign: "center" }}>
                <h1 style={{ fontSize: 20, marginBottom: 12 }}>
                    {status === "connecting" && "Conectando con WebContainer..."}
                    {status === "ok" && "Conectado ✅"}
                    {status === "error" && "Error de conexión"}
                </h1>
                <p>{message}</p>
            </div>
        </div>
    );
}


