
export const filterTruthyValues = (Obj: any) => {
    return Object.fromEntries(
        Object.entries(Obj).filter(([key, value]) => (value))
    );
}