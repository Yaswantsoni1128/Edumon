/**
 * Generates a password based on specific institutional format: 
 * 3char of name, 3 char of rollnumber, 3 char of father name
 */
export const generateInstitutionalPassword = (name, rollNo, fatherName) => {
  const n = name.replace(/\s/g, '').substring(0, 3);
  const r = rollNo.replace(/\s/g, '').substring(0, 3);
  const f = (fatherName || 'EDU').replace(/\s/g, '').substring(0, 3);
  
  return (n + r + f).toLowerCase();
};
