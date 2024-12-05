const generateCookie = async () => {
    const url = 'https://bimasislam.kemenag.go.id/jadwalshalat';

    let phpsess = "";
    try {
        const head = await fetch(url, {
            method: "HEAD"
        })
        if (head.status === 200)
            phpsess = head.headers.getSetCookie()[0].split(";")[0].trim();

    } catch (error) {
        if (error) return phpsess;
    }

    console.log(phpsess);

    return phpsess;
};

generateCookie();

export default generateCookie