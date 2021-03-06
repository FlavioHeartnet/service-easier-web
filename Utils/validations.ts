export default function validateCPF(cpf) {	
	cpf = cpf.replace(/[^\d]+/g,'');	
	if(cpf == '') return false;	
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
			return false;		
	// Valida 1o digito	
	let add = 0;	
	for (let i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		let rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return false;		
	// Valida 2o digito	
	add = 0;	
	for (let i = 0; i < 10; i ++)		
		add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11)	
		rev = 0;	
	if (rev != parseInt(cpf.charAt(10)))
		return false;		
	return true;   
}

export function calcComission(list: any[], comision):[number,number]{
	let rent = Math.round(list.reduce((acc,c) => acc + parseFloat(c.price), 0))
	return [rent, rent*(comision/100)]
}

export function validateComission(comission:number):number{
	return comission == 0 ? 100: comission
}

export function validatePayDay(payday:number):number{
	return payday == 0 ? 100: payday
}

export function priceFormat(price:number, currency:string):string{
	switch(currency){
		case 'br': return 'R$ '+ price.toString().replace('.',',')
	}
}

export function groupBy(key) {
	return function group(array) {
	  return array.reduce((acc, obj) => {
		let property = obj[key];
		acc[property] = acc[property] || [];
		acc[property].push(obj);
		return acc;
	  }, {});
	};
  }