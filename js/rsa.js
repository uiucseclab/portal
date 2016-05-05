//RSA encryption/decryption, no padding used
//Data, key and N are decimal strings

function RSAencrypt(plain, pub, N) {
	return new BigInteger(plain, 10).modPow(new BigInteger(pub, 10), new BigInteger(N, 10)).toString();
}

function RSAdecrypt(cipher, priv, N) {
	return new BigInteger(cipher, 10).modPow(new BigInteger(priv, 10), new BigInteger(N, 10)).toString();
}

//Generate private key with B bits and E as public key (in decimal string).
function RSAGenerate(B, E) {
	var RNG = new SecureRandom();
	var e = new BigInteger(E, 10);

	var p = new BigInteger("1");
	while (!p.isProbablePrime(20))
		p = new BigInteger(Math.ceil(B/2), 1, RNG);

	var q = new BigInteger("1");
	while (!q.isProbablePrime(20))
		q = new BigInteger(Math.ceil(B/2), 1, RNG);

	var N = p.multiply(q);
	var r = p.subtract(new BigInteger("1")).multiply(q.subtract(new BigInteger("1")));
	var d = e.modInverse(r);
	return {"N": N, "d": d};
}