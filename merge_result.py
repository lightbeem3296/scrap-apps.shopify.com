import os
import json
import csv
from pathlib import Path

CUR_DIR = Path(__file__).parent

def main():
    info_list = []
    for dpath, dnames, fnames in os.walk(CUR_DIR):
        for fname in fnames:
            if not fname.endswith(".json"):
                continue

            fpath = os.path.join(dpath, fname)
            with open(fpath, "r", encoding="utf-8") as file:
                small_info_list = json.load(file)
                info_list.extend(small_info_list)

    print(f"Total records collected: {len(info_list)}")

    # Remove duplicates excluding the 'link' field
    unique_info_list = []
    seen = set()
    for item in info_list:
        # Create a tuple of items excluding 'link' for comparison
        comparison_tuple = tuple((k, item[k]) for k in item if k != 'link')
        
        if comparison_tuple not in seen:
            seen.add(comparison_tuple)
            unique_info_list.append(item)

    print(f"Total unique records (excluding 'link'): {len(unique_info_list)}")

    # Save unique_info_list to CSV
    if unique_info_list:  # Check if unique_info_list is not empty
        csv_file_path = CUR_DIR / 'info_list.csv'  # Specify the CSV file path
        with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
            # Create a CSV writer object
            writer = csv.DictWriter(csvfile, fieldnames=unique_info_list[0].keys())
            writer.writeheader()  # Write the header
            writer.writerows(unique_info_list)  # Write the data

        print(f"Data saved to {csv_file_path}")

if __name__ == "__main__":
    main()
