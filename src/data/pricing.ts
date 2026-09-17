const INTERCITY_DISTANCE_THRESHOLD_KM = 45;

const PROPERTY_TYPE_SURCHARGE: Record<string, number> = {
  residential: 0,
  commercial: 600000,
  office: 450000,
  warehouse: 800000,
  other: 0,
};

const FLOOR_COST_WITHOUT_ELEVATOR = 180000;
const PACKING_COST = 900000;
const LABOR_COST_PER_SIDE = 700000;

export interface CostEstimateInput {
  basePrice: number;
  perKmRate: number;
  floorCostExempt: boolean;
  originFloor: number;
  originHasElevator: boolean;
  originPropertyType: string;
  originLat?: number | null;
  originLng?: number | null;
  destinationFloor: number;
  destinationHasElevator: boolean;
  destinationPropertyType: string;
  destinationLat?: number | null;
  destinationLng?: number | null;
  wantsPacking: boolean;
  laborChoice: 'none' | 'origin' | 'destination' | 'both';
  laborCount?: number;
  heavyItemsCount?: number;
}

export interface CostEstimate {
  min: number;
  avg: number;
  max: number;
  distanceKm: number | null;
  isIntercity: boolean;
}

export const HEAVY_ITEM_COST = 250000;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function floorCost(floor: number, hasElevator: boolean, exempt: boolean): number {
  if (hasElevator || floor <= 0 || exempt) return 0;
  return floor * FLOOR_COST_WITHOUT_ELEVATOR;
}

function laborCost(choice: CostEstimateInput['laborChoice'], count: number = 2): number {
  if (choice === 'none' || count <= 0) return 0;
  const sides = choice === 'both' ? 2 : 1;
  return LABOR_COST_PER_SIDE * sides * count;
}

function propertyTypeCost(type: string): number {
  return PROPERTY_TYPE_SURCHARGE[type] ?? 0;
}

export interface InvoiceItem {
  id: string;
  title: string;
  description: string;
  amount: number;
}

export interface DetailedInvoice {
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  isIntercity: boolean;
  distanceKm: number | null;
}

export function calculateDetailedInvoice(
  input: CostEstimateInput,
  _options?: { serviceLabel?: string; originCity?: string; destinationCity?: string },
): DetailedInvoice {
  const distanceKm =
    input.originLat != null && input.originLng != null && input.destinationLat != null && input.destinationLng != null
      ? haversineKm(input.originLat, input.originLng, input.destinationLat, input.destinationLng)
      : null;

  const isIntercity = (distanceKm ?? 0) > INTERCITY_DISTANCE_THRESHOLD_KM;
  const baseFare = isIntercity ? input.perKmRate * (distanceKm as number) : input.basePrice;

  const originFloorCost = floorCost(input.originFloor, input.originHasElevator, input.floorCostExempt);
  const destFloorCost = floorCost(input.destinationFloor, input.destinationHasElevator, input.floorCostExempt);
  const totalFloorCost = originFloorCost + destFloorCost;

  const propCost = propertyTypeCost(input.originPropertyType) + propertyTypeCost(input.destinationPropertyType);
  const laborCount = input.laborChoice === 'none' ? 0 : Math.max(1, input.laborCount ?? 2);
  const laborAmount = laborCost(input.laborChoice, laborCount);
  const heavyItemsCount = Math.max(0, input.heavyItemsCount ?? 0);
  const heavyItemsAmount = heavyItemsCount * HEAVY_ITEM_COST;
  const packingAmount = input.wantsPacking ? PACKING_COST : 0;

  const freightTotal = Math.round(baseFare + propCost);

  const items: InvoiceItem[] = [
    {
      id: 'freight',
      title: 'اجرت پایه و کارشناسی خدمات',
      description: 'کارشناسی اولیه، عیب‌یابی در محل و اجرت پایه تکنسین متخصص بهدون',
      amount: freightTotal,
    },
  ];

  if (laborAmount > 0) {
    items.push({
      id: 'labor',
      title: `اعزام تکنسین و نیروی متخصص (${laborCount} نفر)`,
      description: `تعداد ${laborCount} تکنسین مجرب و دارای گواهینامه مهارت جهت اجرای تخصصی خدمات`,
      amount: laborAmount,
    });
  } else {
    items.push({
      id: 'labor',
      title: 'نیروی متخصص تکنسین',
      description: 'اعزام ۱ تکنسین استاندارد بهدون',
      amount: 0,
    });
  }

  if (heavyItemsAmount > 0) {
    items.push({
      id: 'heavy_items',
      title: `ابزارآلات تخصصی و تجهیزات پیشرفته (${heavyItemsCount} مورد)`,
      description: 'استفاده از دستگاه نشت‌یاب آکوستیک، فنر زن صنعتی یا پمپ اسیدشویی استاندارد',
      amount: heavyItemsAmount,
    });
  }

  if (packingAmount > 0) {
    items.push({
      id: 'packing',
      title: 'لوازم و ملزومات مصرفی استاندارد',
      description: 'تأمین قطعات و لوازم استاندارد اولیه با فاکتور و ضمانت تعویض کتبی',
      amount: packingAmount,
    });
  }

  if (totalFloorCost > 0) {
    items.push({
      id: 'floors',
      title: 'ایاب و ذهاب و سختی کار پروژه',
      description: 'هزینه استقرار و ابزاربری در پروژه‌های چندطبقه بدون آسانسور',
      amount: totalFloorCost,
    });
  }

  const total = freightTotal + laborAmount + heavyItemsAmount + packingAmount + totalFloorCost;

  return {
    items,
    subtotal: total,
    discount: 0,
    tax: 0,
    total,
    isIntercity,
    distanceKm: distanceKm != null ? Math.round(distanceKm) : null,
  };
}

export function resolveOrderInvoice(order: {
  estimateAvg: number;
  serviceLabel?: string;
  originFloor?: number;
  originElevator?: boolean;
  destinationFloor?: number;
  destinationElevator?: boolean;
  wantsPacking?: boolean;
  laborChoice?: string;
  laborCount?: number;
  invoiceItems?: InvoiceItem[] | null;
  originCity?: string;
  destinationCity?: string;
}): DetailedInvoice {
  if (Array.isArray(order.invoiceItems) && order.invoiceItems.length > 0) {
    const total = order.invoiceItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    return {
      items: order.invoiceItems,
      subtotal: total,
      discount: 0,
      tax: 0,
      total,
      isIntercity: false,
      distanceKm: null,
    };
  }

  const laborChoice = (order.laborChoice || 'none') as CostEstimateInput['laborChoice'];
  const laborCount = laborChoice === 'none' ? 0 : Math.max(1, order.laborCount ?? 2);
  let laborAmount = 0;
  let laborDesc = 'عدم درخواست تکنسین اضافی';
  if (laborChoice === 'both' || laborChoice === 'origin' || laborChoice === 'destination') {
    laborAmount = LABOR_COST_PER_SIDE * laborCount;
    laborDesc = `خدمات تکنسین متخصص بهدون در تهران (${laborCount} نفر)`;
  }

  const packingAmount = order.wantsPacking ? PACKING_COST : 0;
  let floorAmount = 0;
  const floorDetails: string[] = [];
  if (!order.originElevator && (order.originFloor ?? 0) > 0) {
    floorAmount += (order.originFloor ?? 0) * FLOOR_COST_WITHOUT_ELEVATOR;
    floorDetails.push(`طبقه ${order.originFloor} (بدون آسانسور)`);
  }

  const total = Math.max(order.estimateAvg || 0, 1000000);
  const extraCosts = laborAmount + packingAmount + floorAmount;
  let freightAmount = total - extraCosts;
  if (freightAmount < 400000) {
    freightAmount = Math.round(total * 0.55);
  }

  // Adjust total to match items sum
  const itemsSum = freightAmount + laborAmount + packingAmount + floorAmount;

  const items: InvoiceItem[] = [
    {
      id: 'freight',
      title: 'اجرت پایه و کارشناسی خدمات',
      description: order.originCity
        ? `اعزام کارشناس و اجرای خدمت در محدوده ${order.originCity} تهران`
        : 'اجرت پایه و کارشناسی تخصصی تکنسین بهدون',
      amount: freightAmount,
    },
    {
      id: 'labor',
      title: 'خدمات اعزام تکنسین متخصص',
      description: laborDesc,
      amount: laborAmount,
    },
  ];

  if (packingAmount > 0) {
    items.push({
      id: 'packing',
      title: 'لوازم و قطعات مصرفی استاندارد',
      description: 'قطعات اورجینال و مصرفی استاندارد همراه با گارانتی تعویض کتبی',
      amount: packingAmount,
    });
  }

  if (floorAmount > 0) {
    items.push({
      id: 'floors',
      title: 'ایاب و ذهاب و سختی کار پروژه',
      description: floorDetails.join(' · '),
      amount: floorAmount,
    });
  }

  return {
    items,
    subtotal: itemsSum,
    discount: 0,
    tax: 0,
    total: itemsSum,
    isIntercity: false,
    distanceKm: null,
  };
}

export function estimateCost(input: CostEstimateInput): CostEstimate {
  const detailed = calculateDetailedInvoice(input);
  const total = detailed.total;

  return {
    min: Math.round(total * 0.9),
    avg: Math.round(total),
    max: Math.round(total * 1.15),
    distanceKm: detailed.distanceKm,
    isIntercity: detailed.isIntercity,
  };
}

