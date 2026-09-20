export type AssignedStaff = {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
};

export type Branch = {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  regularPrice: number;
  rushPrice: number;
  assignedStaff: AssignedStaff[];
};

export const branches: Branch[] = [
  {
    id: 'nabunturan',
    name: 'WashWise - Nabunturan Branch',
    location: 'Poblacion, Nabunturan, Davao de Oro',
    type: 'Main Branch',
    status: 'Open',
    regularPrice: 70,
    rushPrice: 100,
    // Temporary UI data. Later this comes from staffAccounts where branchId matches this branch.
    assignedStaff: [
      {
        id: 'maria-santos',
        fullName: 'Maria Santos',
        email: 'maria@washwise.com',
        isActive: true,
      },
      {
        id: 'kevin-ramos',
        fullName: 'Kevin Ramos',
        email: 'kevin@washwise.com',
        isActive: true,
      },
    ],
  },
  {
    id: 'maco',
    name: 'WashWise - Maco Branch',
    location: 'Maco, Davao de Oro',
    type: 'Branch',
    status: 'Open',
    regularPrice: 70,
    rushPrice: 100,
    // Temporary UI data. Later this comes from staffAccounts where branchId matches this branch.
    assignedStaff: [
      {
        id: 'john-dela-cruz',
        fullName: 'John Dela Cruz',
        email: 'john@washwise.com',
        isActive: false,
      },
    ],
  },
];

export function findBranchById(id: string | string[] | undefined) {
  const branchId = Array.isArray(id) ? id[0] : id;

  return branches.find((branch) => branch.id === branchId);
}
