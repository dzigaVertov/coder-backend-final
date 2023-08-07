export function getFecha(){
    const fecha = new Date().toISOString().slice(0,10);
    return fecha;
}
