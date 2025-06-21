import axios from "axios";
import { hostName } from "./host";



const domainName = hostName();
export const findCompanyName = (company, id) => {
    try {
        const com = company.find(c => c.id == id);
        if (com) {
            return com.branchName
        }
        return 'No Company'
    } catch (e) {
        return 'No Company'
    }
}
export const findEmployeeImageUrl = (employee, id) => {
    try {
        const emp = employee.find(e => e.id == id);
        if (emp) {
            return `http://${domainName}:8085/api/images/${emp.image}`;
        }
        return null;
    } catch (e) {
        return null;
    }
};

export const findCustomerImageUrl = (customer, id) => {
    try {
        const cus = customer.find(c => c.id == id);
        if (cus) {
            return `http://${domainName}:8085/api/images/${cus.image}`;
        }
        return null;
    } catch (e) {
        return null;
    }
};
