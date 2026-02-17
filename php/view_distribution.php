<?php
/**
 * Page simple pour visualiser la distribution actuelle
 * Accédez à cette page dans votre navigateur pour voir les statistiques
 */

header('Content-Type: text/html; charset=utf-8');

$distribution_file = '../data/distribution.json';

if (!file_exists($distribution_file)) {
    echo "<h1>Aucune donnée de distribution disponible</h1>";
    exit();
}

$distribution = json_decode(file_get_contents($distribution_file), true);

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Distribution Group/Solo par Niveau</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #6b8e6e;
            text-align: center;
        }
        .distribution-table {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-top: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #6b8e6e;
            color: white;
            font-weight: 600;
        }
        tr:hover {
            background: #f9f9f9;
        }
        .total {
            font-weight: bold;
            color: #b56b4a;
        }
        .balanced {
            color: #6b8e6e;
        }
        .unbalanced {
            color: #b56b4a;
        }
        .stats {
            margin-top: 20px;
            padding: 15px;
            background: #eef3ef;
            border-left: 4px solid #6b8e6e;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>📊 Distribution Group/Solo par Niveau d'Études</h1>

    <div class="distribution-table">
        <table>
            <thead>
                <tr>
                    <th>Niveau</th>
                    <th>Group</th>
                    <th>Solo</th>
                    <th>Total</th>
                    <th>Équilibre</th>
                </tr>
            </thead>
            <tbody>
                <?php
                foreach (['L1', 'L2', 'L3'] as $level) {
                    $group = $distribution[$level]['group'];
                    $solo = $distribution[$level]['solo'];
                    $total = $group + $solo;
                    $diff = abs($group - $solo);
                    $balance = $diff === 0 ? '✅ Parfait' : ($diff === 1 ? '✓ Bon' : '⚠️ Déséquilibré');
                    $balanceClass = $diff <= 1 ? 'balanced' : 'unbalanced';

                    echo "<tr>";
                    echo "<td><strong>$level</strong></td>";
                    echo "<td>$group</td>";
                    echo "<td>$solo</td>";
                    echo "<td class='total'>$total</td>";
                    echo "<td class='$balanceClass'>$balance</td>";
                    echo "</tr>";
                }

                // Totaux
                $totalGroup = $distribution['L1']['group'] + $distribution['L2']['group'] + $distribution['L3']['group'];
                $totalSolo = $distribution['L1']['solo'] + $distribution['L2']['solo'] + $distribution['L3']['solo'];
                $grandTotal = $totalGroup + $totalSolo;
                ?>
                <tr style="background: #f0f0f0; font-weight: bold;">
                    <td>TOTAL</td>
                    <td><?php echo $totalGroup; ?></td>
                    <td><?php echo $totalSolo; ?></td>
                    <td class="total"><?php echo $grandTotal; ?></td>
                    <td>-</td>
                </tr>
            </tbody>
        </table>

        <div class="stats">
            <strong>📈 Statistiques globales :</strong><br>
            Participants totaux : <?php echo $grandTotal; ?><br>
            Condition Group : <?php echo $totalGroup; ?> (<?php echo $grandTotal > 0 ? round($totalGroup/$grandTotal*100, 1) : 0; ?>%)<br>
            Condition Solo : <?php echo $totalSolo; ?> (<?php echo $grandTotal > 0 ? round($totalSolo/$grandTotal*100, 1) : 0; ?>%)<br>
        </div>

        <p style="text-align: center; margin-top: 20px; color: #666; font-size: 0.9em;">
            Dernière mise à jour : <?php echo date('d/m/Y H:i:s', filemtime($distribution_file)); ?>
        </p>
    </div>
</body>
</html>
