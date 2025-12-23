type CloudResponse =
    | { ok: true }
    | { state: any | null; updated_at: string | null }
    | { error: string };

const FN_URL = () =>
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/advent-state`;

const headers = () => ({
    "content-type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
});

export async function cloudLoad(code: string) {
    const res = await fetch(FN_URL(), {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ action: "load", code }),
    });

    const data = (await res.json().catch(() => ({}))) as CloudResponse;
    if (!res.ok || "error" in data) throw new Error(("error" in data && data.error) || "Cloud load failed");
    return data as { state: any | null; updated_at: string | null };
}

export async function cloudSave(code: string, state: unknown) {
    const res = await fetch(FN_URL(), {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ action: "save", code, state }),
    });

    const data = (await res.json().catch(() => ({}))) as CloudResponse;
    if (!res.ok || "error" in data) throw new Error(("error" in data && data.error) || "Cloud save failed");
    return data as { ok: true };
}
