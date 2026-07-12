import pandas as pd
import numpy as np
from scipy.stats import chi2_contingency, kruskal
import warnings
warnings.filterwarnings('ignore')

def analyze_dataset(file_path, dataset_name):
    print(f"========== Analysis for {dataset_name} ==========")
    data = pd.read_excel(file_path)
    
    # Standardize column names
    data.rename(columns={
        'Inund Depth obs. (m)': 'Inund Depth',
        'Damage Indices (0-4)': 'Damage Indices',
        'Material (RC, Steel, Wood, Masonry)': 'Material'
    }, inplace=True)
    
    # 1. Chi-Square Test for Material vs Damage Index
    print("\n1. Chi-Square Test of Independence (Material vs Damage Indices)")
    contingency_table = pd.crosstab(data['Material'], data['Damage Indices'])
    chi2, p, dof, expected = chi2_contingency(contingency_table)
    print(f"   Chi-Square Statistic: {chi2:.2f}")
    print(f"   p-value: {p:.2e}")
    if p < 0.05:
        print("   Conclusion: Significant relationship between Material and Damage Severity.")
    else:
        print("   Conclusion: No significant relationship found.")
        
    # 2. Kruskal-Wallis Test for Inundation Depth across Damage Indices
    print("\n2. Kruskal-Wallis H-test (Inundation Depth across Damage Indices)")
    groups = [group['Inund Depth'].values for name, group in data.groupby('Damage Indices')]
    stat, p_kw = kruskal(*groups)
    print(f"   Kruskal-Wallis H Statistic: {stat:.2f}")
    print(f"   p-value: {p_kw:.2e}")
    if p_kw < 0.05:
        print("   Conclusion: Inundation Depth significantly affects the Damage Grade.")
    else:
        print("   Conclusion: Inundation Depth is not significantly different across Damage Grades.")
        
    print("\n")

if __name__ == '__main__':
    analyze_dataset('../Building_data.xlsx', 'Building Data')
    analyze_dataset('../Infrastructure.xlsx', 'Infrastructure Data')
