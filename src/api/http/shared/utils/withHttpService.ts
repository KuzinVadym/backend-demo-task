function validateDomain(domainsList: string[], domainName: string): void {
  if (!domainsList.includes(domainName)) {
    throw new Error(
      `Can't find domain name ${domainName} among available services`
    );
  }
}

export function withHttpService(serviceName: string, getState) {
  validateDomain(Object.keys(getState().httpServices), serviceName);

  return getState().httpServices[serviceName];
}
